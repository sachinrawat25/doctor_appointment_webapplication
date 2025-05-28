import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ============ handle availiblity
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <div className="booking-container">
        <h3 className="booking-title">Book Your Appointment</h3>
        {doctors && (
          <>
            <div className="doctor-info">
              <h4>
                <i className="fa-solid fa-user-doctor me-2"></i>
                Dr. {doctors.firstName} {doctors.lastName}
              </h4>
              <h4>
                <i className="fa-solid fa-money-bill me-2"></i>
                Fees: ${doctors.feesPerCunsaltation}
              </h4>
              <h4>
                <i className="fa-solid fa-clock me-2"></i>
                Timings: {doctors.timings && doctors.timings[0]} -{" "}
                {doctors.timings && doctors.timings[1]}
              </h4>
            </div>
            <div className="booking-form">
              <div className="row">
                <div className="col-md-6">
                  <DatePicker
                    aria-required={"true"}
                    format="DD-MM-YYYY"
                    className="mb-3"
                    onChange={(value) => {
                      setDate(moment(value).format("DD-MM-YYYY"));
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <TimePicker
                    aria-required={"true"}
                    format="HH:mm"
                    className="mb-3"
                    onChange={(value) => {
                      setTime(moment(value).format("HH:mm"));
                    }}
                  />
                </div>
              </div>
              <button
                className="booking-btn btn-check-availability"
                onClick={handleAvailability}
              >
                <i className="fa-solid fa-calendar-check me-2"></i>
                Check Availability
              </button>
              <button 
                className="booking-btn btn-book-now" 
                onClick={handleBooking}
              >
                <i className="fa-solid fa-book-medical me-2"></i>
                Book Now
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;