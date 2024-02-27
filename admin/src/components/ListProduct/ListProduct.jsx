import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import Swal from "sweetalert2";

function ListProduct() {
  const [allproducts, setAllProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Please choose category");

  const fetchInfo = async () => {
    await fetch("http://localhost:4000/allproduct")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data.data);
      });
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  console.log('allproduct', allproducts)
  const remainProducts = () => {
    console.log('vào đây')
    if (allproducts) {
      let filteredProducts = [...allproducts];
      if (searchTerm.trim() !== '') {
        filteredProducts = filteredProducts.filter((product) => (
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      }
      if (selectedCategory !== "Please choose category") {
        // Nếu có loại danh mục được chọn, lọc theo loại danh mục
        filteredProducts = filteredProducts.filter(
          (product) => product.category === selectedCategory
        );
      }
      return filteredProducts;
    }
  }
  const removeProduct = async (id) => {
    Swal.fire({
      title: "Confirm remove cart item",
      text: "Are you sure to remove this cart item",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("http://localhost:4000/removeproduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
      }
    });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="mx-4 p-5 mt-3 vh-100 bg-white">
      <h1 className="text-center mb-5">All Product List</h1>
      <div className="row col-sm-12 col-md-12 col-lg-12 cart-table-wrapper">
        <div className="col-md-6 mb-3 py-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3  py-2">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option disabled>Please choose category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <table className="table cart-table">
          <thead>
            <tr>
              <th className="text-center">Product</th>
              <th className="text-center">Title</th>
              <th className="text-center">Old Price</th>
              <th className="text-center">New Price</th>
              <th className="text-center">Category</th>
              <th className="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {remainProducts() && remainProducts().map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      className="product-image"
                      src={product.image}
                      alt=""
                    />
                  </div>
                </td>
                <td className="text-center fw-bold">{product.name}</td>
                <td className="text-center">${product.old_price}</td>
                <td className="text-center text-danger fw-bold">
                  ${product.new_price}
                </td>
                <td className="text-center">{product.category}</td>
                <td className="text-center">
                  <img
                    onClick={() => removeProduct(product.id)}
                    className="listproduct-remove-icon"
                    src={cross_icon}
                    alt=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListProduct;
