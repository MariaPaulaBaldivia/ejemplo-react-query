import React, { createContext, useContext } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

type Post = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
  return data;
};

const PostsContext = createContext<ReturnType<typeof useQuery<Post[], Error>> | undefined>(undefined);

type PostsProviderProps = {
  children: React.ReactNode;
};

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const query = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return <PostsContext.Provider value={query}>{children}</PostsContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};