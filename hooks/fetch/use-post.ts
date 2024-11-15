import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import { PostData } from "@/types/post-types";
import { getPostById } from "@/services/post-service";

const usePost = (id: string) => {
  const [post, setPost] = useState<PostData>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { post } = await getPostById(id);
        setPost(post);
      } catch (error: any) {
        console.error(error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    };

    fetchPost();
  }, []);

  return post;
};

export default usePost;