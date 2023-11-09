import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import ProductDetails from "@/components/productDetails";

function ProductDetailPage(props) {
  const { product, relatedItem } = props;

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(product).length === 0) {
      router.push("/not-found");
    }
  }, [product, router]);

  if (Object.keys(product).length === 0) {
    return null;
  }

  return <ProductDetails product={product} relatedItem={relatedItem} />;
}

export default ProductDetailPage;

ProductDetailPage.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  relatedItem: PropTypes.instanceOf(Array).isRequired,
};

export async function getServerSideProps(req) {
  try {
    const { params } = req;

    const [response, relatedItem] = await Promise.all([
      axios.get(`https://fakestoreapi.com/products/${params.id}`),
      axios.get("https://fakestoreapi.com/products?limit=4"),
    ]);

    return {
      props: {
        product: response.data || {},
        relatedItem: relatedItem.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
