import React from 'react';
import { usePosts } from './PostsContext';

type Post = {
    id: number;
    name: string;
    username: string;
    email: string;
  };

const AnotherComponent: React.FC = () => {
  const { data, isLoading, isError } = usePosts();

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los datos.</p>;

  return (
    <ul>
      {data?.map((post: Post) => (
        <li key={post.id}>{post.name} {post.id}</li>
      ))}
    </ul>
  );
};

export default AnotherComponent;