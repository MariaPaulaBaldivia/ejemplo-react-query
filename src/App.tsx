import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FetchPosts from './FetchPosts';
import { PostsProvider } from './PostsContext';
import  AnotherComponent from './AnotherComponent'

const queryClient = new QueryClient();

function App() {
  console.log(queryClient, "HOLAAA");
  return (
    <QueryClientProvider client={queryClient}>
<FetchPosts />
      {/* <PostsProvider>
        <FetchPosts />
        <AnotherComponent />
      </PostsProvider> */}
    </QueryClientProvider>
  );
}

export default App;
