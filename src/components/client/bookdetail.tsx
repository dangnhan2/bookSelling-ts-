import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import "@/styles/app.book.scss";
import ModalGallery from "./modalgallery";
interface IProps {
  data: IBookTable | undefined;
}

interface ImgProps {
  original: string;
  thumbnail: string;
  originalClass: string;
  thumbnailClass: string;
}
const BookDetail = (props: IProps) => {
  const { data } = props;
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesArr, setImages] = useState<ImgProps[]>([]);

  const [quantity, setQuantity] = useState(1);
  const refGallery = useRef<ImageGallery>(null);
  console.log(quantity);

  const handleMinus = () => {
    if (quantity === 1) {
      return;
    } else {
      setQuantity(quantity - 1);
    }
  };

  const handlePlus = () => {
    if (quantity === data?.quantity) {
      return quantity;
    } else {
      setQuantity(quantity + 1);
    }
  };
  const handleQuantity = (e) => {
    if (Number(e.target.value) >= 1 && Number(e.target.value) <= data?.quantity)
      setQuantity(Number(e.target.value));
  };

  useEffect(() => {
    let imageArr: ImgProps[] = [];
    let image: any = {};
    if (data?.thumbnail) {
      imageArr.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          data?.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          data?.thumbnail
        }`,
        originalClass: "original-image",
        thumbnailClass: "thumbnail-image",
      });
    }

    if (data?.slider) {
      data.slider.map(
        (item) => (
          (image = {
            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            thumbnail: `${
              import.meta.env.VITE_BACKEND_URL
            }/images/book/${item}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          }),
          imageArr.push(image)
        )
      );
    }
    setImages(imageArr);
  }, [data]);

  const handleOnClickImage = () => {
    //get current index onClick
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-book"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={imagesArr}
                showPlayButton={false} //hide play button
                showFullscreenButton={false} //hide fullscreen button
                renderLeftNav={() => <></>} //left arrow === <> </>
                renderRightNav={() => <></>} //right arrow === <> </>
                slideOnThumbnailOver={true} //onHover => auto scroll images
                onClick={() => handleOnClickImage()}
              />
            </Col>
            <Col md={14} sm={24}>
              <Col md={0} sm={24} xs={24}>
                <ImageGallery
                  ref={refGallery}
                  items={imagesArr}
                  showPlayButton={false} //hide play button
                  showFullscreenButton={false} //hide fullscreen button
                  renderLeftNav={() => <></>} //left arrow === <> </>
                  renderRightNav={() => <></>} //right arrow === <> </>
                  showThumbnails={false}
                />
              </Col>
              <Col span={24}>
                <div className="author">
                  Tác giả: <a href="#">{data?.author}</a>{" "}
                </div>
                <div className="title">{data?.mainText}</div>
                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    <Divider type="vertical" />
                    Đã bán {data?.sold}
                  </span>
                </div>
                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data?.price)}
                  </span>
                </div>
                <div className="delivery">
                  <div>
                    <span className="left">Vận chuyển</span>
                    <span className="right">Miễn phí vận chuyển</span>
                  </div>
                </div>
                <div className="quantity">
                  <span className="left">Số lượng</span>
                  <span className="right">
                    <button onClick={handleMinus}>
                      <MinusOutlined />
                    </button>
                    <input
                      value={quantity}
                      onChange={(e) => handleQuantity(e)}
                    />
                    <button onClick={handlePlus}>
                      <PlusOutlined />
                    </button>
                  </span>{" "}
                  &nbsp;&nbsp; &nbsp;&nbsp;
                  <span style={{ color: "#757575" }}>
                    {data?.quantity} sản phẩm có sẵn
                  </span>
                </div>
                <div className="buy">
                  <button className="cart">
                    <BsCartPlus className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="now">Mua ngay</button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imagesArr}
        title={data?.mainText}
      />
    </div>
  );
};

export default BookDetail;
