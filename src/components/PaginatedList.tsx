import { useState, useEffect, ReactEventHandler } from "react";

const API_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

type Post = {
  userId: string;
  id: number;
  title: string;
  body: string;
};

type PaginatedListProps = {
  itemsPerPageOptions?: number[];
};

const PaginatedList: React.FC<PaginatedListProps> = ({
  itemsPerPageOptions = [5, 10, 20],
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  async function fetchPosts() {
    try {
      setIsLoading(true);

      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        setError("Server side failure when fetching posts.");
        return;
      }

      const data = await response.json();

      setPosts(data);
      setError(null);
    } catch (e) {
      setError("Failed to fetch posts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  function handleItemsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  return (
    <div id="main-container">
      <h2 id="main-header">Posts</h2>
      {isLoading && <p id="loading-status">Loading ...</p>}
      {error && <p id="error-message">{error}</p>}
      <ul>
        {currentPosts.map((post: Post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      <div id="pagination-controls">
        <button
          id="prev-page-button"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Prev
        </button>
        <span>
          {" "}
          {currentPage} of {totalPages}{" "}
        </span>
        <button
          id="next-page-button"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      <div id="page-size-controls">
        <label id="page-size-label">Items per page: </label>
        <select
          id="page-size-selector"
          value={itemsPerPage}
          onChange={handleItemsPerPage}
        >
          {itemsPerPageOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginatedList;
