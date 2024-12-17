import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, fetchPosts , deletePost} from './services/PostService';
import { Post } from './types/Post';

export const FetchPosts = () => {
  const { data: posts, isLoading, isError } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState(1);

  const { mutateAsync: createPostMutation } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  })

  interface Context {
    previousPosts: Post[];
  }

  const { mutateAsync: deletePostMutation} = useMutation<number, Error, number, Context>({
    mutationFn: deletePost,
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']) ?? [];
      queryClient.setQueryData<Post[]>(['posts'], (oldPosts) =>
        oldPosts?.filter((post) => post.id !== postId) ?? []
      );
      return { previousPosts };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });


  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  return (
    <>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>{post.id} {post.body} {post.title}
            <button onClick={async () => {
              try {
                await deletePostMutation(post.id);
              } catch (error) {
                console.error('createPost error:', error);
              }
            }}>Delete </button>
          </li>
        ))}
      </ul>
      <br />
      <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
        <h2>Crear un nuevo post:</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await createPostMutation({ title, body, userId });
            setTitle('');
            setBody('');
            setUserId(1);
          } catch (error) {
            console.error('createPost error:', error);
          }
        }}>
          <input
            type="number"
            placeholder="User Id"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <br />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <br />
          <button type='submit'
          >Create Post</button>
        </form>
      </div>
    </>
  );
}

export default FetchPosts;