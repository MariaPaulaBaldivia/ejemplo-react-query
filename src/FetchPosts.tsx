import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, fetchPosts , deletePost} from './services/PostService';
import { Post } from './types/Post';
import Table from 'react-bootstrap/Table';

export const FetchPosts = () => {
  const { data: posts, isLoading: isLoadingFetch,  isError: isErrorFetch } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userName, setUserName] = useState('');

  const { mutateAsync: createPostMutation } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  })

  interface Context {
    previousPosts: Post[];
  }

  const { mutateAsync: deletePostMutation } = useMutation<number, Error, number, Context>({
    mutationFn: deletePost,
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']) ?? []; // Acá se obtienen los datos guardados en cache con la key 'posts', evitando otro fetch
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) =>
        oldPosts?.filter((post) => post.id !== postId) ?? []
      );
      return { previousPosts };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      alert(`Error al eliminar el post con ID ${postId}: ${err.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isLoadingFetch) return <p>Cargando...</p>;
  if (isErrorFetch) return <p>Error al cargar los datos.</p>;

  return (
    <>
      <Table striped bordered hover>
        <thead className='bg'>
          <tr>
            <th>ID Post</th>
            <th>Title</th>
            <th>Body</th>
            <th>User Name</th></tr>
        </thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>{post.userName}</td>
              <td>
                <button onClick={async () => {
                  try {
                    await deletePostMutation(post.id);
                  } catch (error) {
                    console.error('DeletePost error:', error);
                  }
                }}>Delete </button>
              </td>
            </tr>
          ))}
          </tbody>
      </Table>
      <br />
      <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
        <h2>Crear un nuevo post:</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createPostMutation({ title, body, userName });
            setTitle('');
            setBody('');
            setUserName('');
          } catch (error) {
            console.error('createPost error:', error);
          }
        }}>
          <label> Title: <br />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          </label> <br />
          <label> Body:
          <br />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          /></label>
          <br />
          <label> User Name:   <br />
          <input
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          /></label>
          <br />
          <button className='btn btn-primary m-2' type='submit'
          >Create Post</button>
        </form>
      </div>
    </>
  );
}

export default FetchPosts;