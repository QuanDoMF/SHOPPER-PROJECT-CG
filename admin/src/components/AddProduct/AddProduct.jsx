import React, { useState } from "react";
import "./AddProduct.css"
import upload_area from "../../assets/upload_area.svg"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from "../../utils/constants";
const schema = yup.object({
  name: yup.string().required('Product title is required'),
  new_price: yup.string().required('Offer Price is required'),
  old_price: yup.string().required('Price is required'),
  category: yup.string().required('Product Category is required'),
});
function AddProduct() {

  const [image, setImage] = useState(false)

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const handleFormSubmit = async (data) => {
    if (!image) {
      // Kiểm tra xem người dùng đã tải ảnh lên chưa
      toast.error('Please upload an image.');
      return;
    }
    let product = { ...data, image: "" }
    let formData = new FormData()
    formData.append('product', image)
    try {
      let responseData = await axios.post(`${API_ROOT}/upload`, formData)
      if (responseData.data.success) {
        product.image = responseData.data.image_url
        // console.log("product", product)
        let resonseFormData = await axios.post(`${API_ROOT}/addproduct`, product)
        toast.success('Product Added')
        reset()
        setImage(false)
        // console.log("resonseFormData", resonseFormData)
      } else {
        toast.error('')
      }
    }
    catch (error) {
      console.error("Error:", error);
    }
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  return (
    <div className="add-product">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="addproduct-itemfield">
          <p>Product title</p>
          <input
            className={`form-control ${errors?.name?.message ? 'is-invalid' : ''}`}
            type="text"
            name='name'
            placeholder="Type here"
            {...register('name')}
          />
          <span className="invalid-feedback">{errors?.name?.message}</span>
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Price</p>
            <input
              className={`form-control ${errors?.old_price?.message ? 'is-invalid' : ''}`}
              type="text"
              name='old_price'
              placeholder="Type here"
              {...register('old_price')}
            />
            <span className="invalid-feedback">{errors?.old_price?.message}</span>
          </div>
          <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input
              type="text"
              name='new_price'
              placeholder="Type here"
              className={`form-control ${errors?.new_price?.message ? 'is-invalid' : ''}`}
              {...register('new_price')}
            />
            <span className="invalid-feedback">{errors?.new_price?.message}</span>
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select
            name="category"
            className={` ${errors?.category?.message ? 'is-invalid' : ''} add-product-selector`}
            {...register('category')}
          >
            <option value="" disabled selected>Please select a clothing type</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
          <span className="invalid-feedback">{errors?.category?.message}</span>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div >
            <label role='button' htmlFor="file-input">
              <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumnail-img" alt="" />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
          </div>
          <button type="submit" className="addproduct-btn">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;