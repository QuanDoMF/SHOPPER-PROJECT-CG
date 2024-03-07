import React, { useState, useEffect } from 'react';
import './OrderList.css';
import { MdReadMore } from "react-icons/md";
import dayjs from 'dayjs';
import { API_ROOT } from '../../utils/constants';
const OrderList = () => {
  const [selectOrder, setSelectOrder] = useState(null)

  const [orderList, setOrderList] = useState([])
  const fetchOrderList = async () => {
    await fetch(`${API_ROOT}/orderlist`)
      .then((res) => res.json())
      .then((data) => {
        setOrderList(data)
      })
  }
  // console.log('orderList', orderList)
  useEffect(() => {
    fetchOrderList()
  }, [])
  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`${selectOrder ? 'col-md-7' : 'col-md-12'}`}>
          <h3 className='text-center p-3'>Order Management</h3>
          <hr />
          <table className="table table-striped order-table">
            <thead>
              <tr>
                <th className="text-end align-middle">Order Date</th>
                <th className="text-center align-middle">Total Products</th>
                <th className="text-center align-middle">Subtotal</th>
                <th className="text-center align-middle">Shipping</th>
                <th className="text-center align-middle">Total Amount</th>
                <th className="text-end align-middle">Status</th>
                <th className="text-center align-middle">Customer Name</th>
                <th className="text-end align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                orderList?.map((order) => (
                  <tr key={order.orderId}>
                    <td className="text-end align-middle">{dayjs(order.orderInfo.orderDate).format('MMM DD YYYY')}</td>
                    <td className="text-center align-middle">
                      {order.orderDetails.length}
                    </td>
                    <td className="text-center align-midd  le">
                      ${order?.orderInfo?.subTotal}
                    </td>
                    <td className="text-center align-middle">
                      {`${order?.orderInfo?.shipping ? '$' + order?.orderInfo?.shipping : 'Free'}`}
                    </td>
                    <td className="text-center align-middle">
                      ${order?.orderInfo?.total}
                    </td>
                    <td className="text-end align-middle">
                      <span className="badge bg-success">{order?.orderInfo?.status}</span>
                    </td>
                    <td className="text-center align-middle">
                      {order?.customerInfo?.fullname}
                    </td>
                    <td className="text-end align-middle">
                      <MdReadMore size={20} color="green" role="button"
                        onClick={() => setSelectOrder(order)}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {
          selectOrder &&
          <div className="col-lg-5 border mt-3 p-3 rounded">
            <div className="d-flex align-items-center justify-content-between border-bottom">
              <h5>Order details</h5>
              <span role="button" className="btn-close" onClick={() => setSelectOrder(null)}></span>
            </div>
            <div className="my-2 border-bottom">
              <h6>Order Information</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span className="fw-bolder">${selectOrder?.orderInfo?.subTotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="fw-bolder">
                  {`${selectOrder?.orderInfo?.shipping ? '$' + selectOrder?.orderInfo?.shipping : 'Free'}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span className="fw-bolder">${selectOrder?.orderInfo?.total}</span>
              </div>
            </div>
            <div className="my-2 border-bottom">
              <h6>Customer Information</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Fullname</span>
                <span className="fw-bolder">{selectOrder?.customerInfo?.fullname}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Email</span>
                <span className="fw-bolder">{selectOrder?.customerInfo?.email}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Mobile</span>
                <span className="fw-bolder">{selectOrder?.customerInfo?.mobile}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Address</span>
                <span className="fw-bolder">{selectOrder?.customerInfo?.address}</span>
              </div>
            </div>
            <div className="my-2 border-bottom">
              <h6>Order details</h6>
              <table className="table table-striped">
                <tbody>
                  {
                    selectOrder?.orderDetails?.map((orderItem) => (
                      <tr key={orderItem.id}>
                        <td style={{ width: "250px" }}>
                          <div className="d-flex align-items-center">
                            <img style={{ width: '50px' }} className="me-2" src={orderItem?.image} />
                            {orderItem?.title}
                          </div>
                        </td>
                        <td className="text-end align-middle">{orderItem?.quantity}</td>
                        <td className="text-end align-middle">${orderItem?.newPrice}</td>
                        <td className="text-end align-middle fw-bolder">${orderItem?.amount}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
export default OrderList