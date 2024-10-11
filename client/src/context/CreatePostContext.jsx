import { createContext, useState } from "react";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStore from "@/app/store";

const INITIAL_DATA = {
  title: "",
  content: "",
};

const CreatePostContext = createContext(null);

export const CreatePostProvider = ({ children }) => {
  const axiosPrivate = useAxiosPrivate();
  const addPost = useStore((state) => state.addPost);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const createPost = async (data, selectedFiles) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      for (const key in data) {
        formData.set(key, data[key]);
      }

      for (const file of selectedFiles) {
        formData.append("images", file);
      }

      const response = await axiosPrivate.post("/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addPost(response?.data?.data);
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    const previews = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === event.target.files.length) {
          setFilePreviews(previews);
        }
      };
      reader.readAsDataURL(event.target.files[i]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createPost(data, selectedFiles);

      setData(INITIAL_DATA);
      setIsPostModalOpen(false);
      setSelectedFiles([]);
      setFilePreviews([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <CreatePostContext.Provider
      value={{
        createPost,
        isSubmitting,
        data,
        selectedFiles,
        filePreviews,
        isPostModalOpen,
        setIsPostModalOpen,
        handleInputChange,
        handleFileChange,
        handleSubmit,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostContext;
