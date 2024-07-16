import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const useSignup = (onLoginSuccess) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize as false
  const navigate = useNavigate();

  const registerUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status === 200) {
        message.success("Registration successful");
        navigate("/login"); // Redirect to login after successful registration
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        message.error("Registration failed");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (values, location) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/v1/users/login?lat=${location.latitude}&lon=${location.longitude}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (res.status === 202) {
        if (onLoginSuccess) onLoginSuccess(); // Call the callback to show the modal
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        message.error("Invalid Credentials");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, registerUser, loginUser };
};

export default useSignup;
