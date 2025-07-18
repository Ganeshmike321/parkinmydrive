import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AxiosClient from "../../axios/AxiosClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosClient.post("/login", formData);

      // Only runs if status is 2xx
      if (response.status === 200 && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Login successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(response.data?.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      // Axios throws for non-2xx responses
      if (err.response?.status === 401) {
        toast.error(err.response.data?.error || "Invalid credentials");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validateForm = (formData: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="loginBg">
          <form onSubmit={handleLogin}>
            <div className="row">
              <div className="">
                <div className="row mb-2">
                  <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                    Email Id<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-7 col-sm-7 col-md-12">
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      name="email"
                      onChange={handleInput}
                    />
                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                  </div>
                </div>

                <div className="row mb-2">
                  <label className="col-xl-4 col-lg-5 col-sm-5 col-md-12 col-form-label">
                    Password<span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-7 col-sm-7 col-md-12">
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      name="password"
                      onChange={handleInput}
                    />
                    {errors.password && <div className="text-danger small">{errors.password}</div>}
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-xl-5 col-lg-12 col-sm-12 col-md-12 offset-lg-5 offset-xl-4">
                    <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
                      {loading ? <Loader /> : "Login"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
