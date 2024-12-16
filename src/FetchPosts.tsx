import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Post = {
  id: number;
  name: string;
  username: string;
  email: string;
};

function FetchPosts() {
  const fetchPosts = async (): Promise<Post[]> => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log(data);
    return data;
  };

  const { data, isLoading, isError } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.name} {post.id}</li>
      ))}
    </ul>
  );
}

export default FetchPosts;