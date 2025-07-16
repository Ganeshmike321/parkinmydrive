import React from "react";
import Footer from "../../components/Footer";
import BreadCrumbs from "../../components/BreadCrumbs";
// import Header from "../../components/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store"; // adjust path as per your setup

const Profile: React.FC = () => {
  const userRedux = useSelector((state: RootState) => state.user.value);

  return (
    <>
      {/* <Header /> */}
      <BreadCrumbs title="Profile" />
      <div className="loginOuter afterownerLogin">
        <div className="container">
          <div className="dashboardList">
            <div className="row">
              <div className="mb-5 col-xl-7 col-lg-7 col-md-12 mx-auto">
                <div className="py-2 shadow card h-100">
                  <div className="card-body p-5">
                    <div className="form-group row">
                      <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
                        Name
                      </label>
                      <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
                        {userRedux.username}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
                        Email
                      </label>
                      <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
                        {userRedux.email}
                      </div>
                    </div>

                    {userRedux.mobile !== "9999999999" && (
                      <div className="form-group row">
                        <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
                          Mobile
                        </label>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
                          {userRedux.mobile}
                        </div>
                      </div>
                    )}

                    <div className="form-group row">
                      <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
                        Password
                      </label>
                      <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
                        ********
                      </div>
                    </div>

                    {/* Additional layout code was commented in original */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;



// import React from "react";
// import Footer from "../../components/Footer";
// import BreadCrumbs from "../../components/BreadCrumbs";
// import Header from "../../components/Header";
// import { useSelector } from "react-redux";
// const Profile = () => {
//     const userRedux = useSelector((state) => {
//         return state.user.value;
//     });
//     return (
//         <>
//             {/* <Header /> */}
//             <BreadCrumbs title="Profile" />
//             <div className="loginOuter afterownerLogin">
//                 <div className="container">
//                     <div className="dashboardList">
//                         <div className="row">
//                             <div className="mb-5 col-xl-7 col-lg-7 col-md-12 mx-auto">
//                                 <div className="py-2 shadow card h-100">
//                                     <div className="card-body p-5">
//                                         <div className="form-group row">
//                                             <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
//                                                 Name
//                                             </label>
//                                             <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
//                                                 {userRedux.username}
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
//                                                 Email
//                                             </label>
//                                             <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
//                                                 {userRedux.email}
//                                             </div>
//                                         </div>
//                                         {userRedux.mobile != '9999999999' && (
//                                             <div className="form-group row">
//                                                 <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
//                                                     Mobile
//                                                 </label>
//                                                 <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
//                                                     {userRedux.mobile}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div className="form-group row">
//                                             <label className="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-xs-12">
//                                                 Password
//                                             </label>
//                                             <div className="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-xs-12 font-weight-bold">
//                                                 ********
//                                             </div>
//                                         </div>
//                                         {/* <div className="row no-gutters align-items-center">
//                                             <div className="mr-2 col">
//                                                 <div className="text-center text-xs font-weight-bold text-primary">
//                                                     <div className="d-flex justify-content-start gap-8">
//                                                         <div className="text-align-left">
//                                                             <div>Name</div>
//                                                             <div>Email</div>
//                                                             <div>Mobile</div>
//                                                             <div>Password</div>
//                                                         </div>


//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default Profile;