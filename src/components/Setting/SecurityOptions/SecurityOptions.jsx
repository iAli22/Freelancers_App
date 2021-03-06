import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  CheckCircleFill,
  PencilFill,
  XCircleFill,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import {
  CardsSkeleton,
  ChangePasswordModel,
  SecurityQuestionModal,
} from "../..";
import { errorToast, successToast } from "../../../helper/toastMessage";
import { getSettings, updateSettings } from "../../../redux/actions/userAction";
import style from "./SecurityOptions.module.scss";

function SecurityOptions() {
  const [showPassModal, setShowPassModal] = useState(false);
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] =
    useState(false);
  const [otpText, setOtpText] = useState({});
  const [securityQuestion, setSecurityQuestion] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSettings())
      .then((res) => {
        setOtpText(
          res.data.data.settings.filter(
            (setting) => setting.name === "two_step_otp_text"
          )[0]
        );
        setSecurityQuestion(
          res.data.data.settings.filter(
            (setting) => setting.name === "two_step_security_question"
          )[0]
        );
      })
      .catch((err) => console.log(`err`, err));
  }, [dispatch]);

  const changeSettings = (name, value) => {
    dispatch(
      updateSettings({
        setting_name: name,
        value: value,
      })
    )
      .then((res) => {
        if (name === otpText.name) {
          setOtpText({ ...otpText, value: value });
        }
        if (name === securityQuestion.name) {
          setSecurityQuestion({
            ...securityQuestion,
            value: value,
          });
        }
        successToast(res.data.message);
      })
      .catch((error) => {
        errorToast(error.message);
      });
  };

  const changeSecurityQuestion = (name, value) => {
    changeSettings(name, value);
    setShowSecurityQuestionModal(false);
  };

  return (
    <>
      <div className={`${style.offerContent} ${style.mobileAppDesign}`}>
        <Row>
          <Col lg={11}>
            <h3>???????? ???????????? ??????????????</h3>
          </Col>
          <Col lg={1} className={style.availableLink}>
            <PencilFill onClick={() => setShowPassModal(true)} />
          </Col>

          {showPassModal && (
            <ChangePasswordModel
              isShow={showPassModal}
              handleClose={(e) => setShowPassModal(e)}
            />
          )}
          {showSecurityQuestionModal && (
            <SecurityQuestionModal
              isShow={showSecurityQuestionModal}
              securityQuestionData={securityQuestion}
              changeSecurityQuestion={changeSecurityQuestion}
              handleClose={(e) => setShowSecurityQuestionModal(e)}
            />
          )}
        </Row>

        <div className={style.PasswordSecurity}>
          <CheckCircleFill />
          <h2>
            ???? ?????? ???????? ?????????? ??????????
            <p>???????? ???????? ???????? ???????? ???????? ???? ?????? ???? 8 ????????</p>
          </h2>
        </div>
      </div>

      <div className={style.offerContent}>
        <Row>
          <Col lg={11}>
            <h3>?????????? ???? ???????? ????????????</h3>
            <p>?????? ???????? ?????????? ???????????? ???????? ???? ???????? ?????? ???????? ???? ????????????</p>
          </Col>
          <Col lg={1}>{/* <PencilFill /> */}</Col>
        </Row>
        {Object.keys(otpText).length > 0 && (
          <div className={style.PasswordSecurity}>
            <h3 className={style.paddingTop}>?????????? ????????</h3>

            <Row>
              <Col lg={10}>
                {otpText.value ? (
                  <CheckCircleFill />
                ) : (
                  <XCircleFill fill={"#ff9d7d"} />
                )}

                <h2 className={otpText.value ? "" : "text-danger"}>
                  {otpText.value ? "??????????" : "??????????"}
                  <p>???????? ?????????? ???????????? ???? ?????????????? ?????? ??????????</p>
                </h2>
              </Col>
              <Col lg={2}>
                <button
                  type='button'
                  onClick={() => changeSettings(otpText.name, !otpText.value)}
                  className={`btn btn-primary ${style.changeTerms}`}
                  style={otpText.value ? { backgroundColor: "#ff9d7d" } : null}>
                  {otpText.value ? "??????????" : "??????????"}
                </button>
              </Col>
            </Row>
          </div>
        )}

        {Object.keys(securityQuestion).length > 0 && (
          <div className={style.PasswordSecurity}>
            <h3 className={style.paddingTop}>?????????? ??????????????</h3>

            <Row>
              <Col lg={10}>
                {securityQuestion.value.is_enabled ? (
                  <CheckCircleFill />
                ) : (
                  <XCircleFill fill={"#ff9d7d"} />
                )}

                <h2
                  className={
                    securityQuestion.value.is_enabled ? "" : "text-danger"
                  }>
                  {securityQuestion.value.is_enabled ? "??????????" : "??????????"}
                  {/* <p>???????? ?????????? ???????????? ???? ?????????????? ?????? ??????????</p> */}
                </h2>
              </Col>
              <Col lg={2}>
                <button
                  type='button'
                  onClick={() =>
                    !securityQuestion.value.is_enabled
                      ? setShowSecurityQuestionModal(true)
                      : changeSettings(securityQuestion.name, {
                          answer: "",
                          is_enabled: false,
                          question: "",
                        })
                  }
                  className={`btn btn-primary ${style.changeTerms}`}
                  style={
                    securityQuestion.value.is_enabled
                      ? { backgroundColor: "#ff9d7d" }
                      : null
                  }>
                  {securityQuestion.value.is_enabled ? "??????????" : "??????????"}
                </button>
              </Col>
            </Row>
          </div>
        )}
        {Object.keys(securityQuestion).length === 0 &&
          Object.keys(otpText).length === 0 && (
            <>
              {[...Array(2)].map((item, index) => (
                <div key={index}>
                  <CardsSkeleton
                    height={120}
                    style={{ marginBottom: "20px" }}
                  />
                </div>
              ))}
            </>
          )}
      </div>
    </>
  );
}

export default SecurityOptions;
