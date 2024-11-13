import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { PostData } from "@/types/post-types";
import { getAllPosts } from "@/services/post-service";

const usePosts = (exclude?: string) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const { posts } = await getAllPosts({ exclude });
        setPosts(posts);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, isLoading };
};

export default usePosts;