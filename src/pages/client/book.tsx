import BookDetail from "@/components/client/bookdetail";
import SkeletonBook from "@/components/client/skeleton";
import { getBookById } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
  const [data, setBookData] = useState<IBookTable>();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  // console.log(params);
  useEffect(() => {
    const getBook = async () => {
      setLoading(true);
      const res = await getBookById(params.id);
      setLoading(false);
      console.log(res);
      if (res && res.data) {
        setBookData(res.data);
      }
    };
    getBook();
  }, [params.id]);
  return (
    <div>
      {loading ? (
        <SkeletonBook></SkeletonBook>
      ) : (
        <BookDetail data={data}></BookDetail>
      )}
    </div>
  );
};

export default BookPage;
