import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Modal, Button, Label, Row, Col, ModalBody, ModalHeader } from "reactstrap";
import { Control, LocalForm, Errors } from 'react-redux-form';
import { sendCode } from "../../redux/AuthenActionCreators";
import { postForgotten } from "../../redux/AuthenActionCreators";
import { postNewPassword } from "../../redux/AuthenActionCreators";
import { withRouter } from "react-router-dom";

const mapDispatchToProps = dispatch => ({
    sendCode: (username) => dispatch(sendCode(username)),
    postForgotten: (username, code) => dispatch(postForgotten(username, code)),
    postNewPassword: (username, password) => dispatch(postNewPassword(username, password))
})

class Forgotten extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen1: true,
            isModalOpen2: false,
            isModalOpen3: false,
            username: "",
        }
        this.handleSubmitUser = this.handleSubmitUser.bind(this);
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this);

    }

    async handleSubmitUser(values) {
        var result = await this.props.sendCode(values.username);
        if (result) {
            this.setState({ 
                username: values.username, 
                isModalOpen1: !this.state.isModalOpen1,
                isModalOpen2: !this.state.isModalOpen2
            });
        }

    }

    async handleSubmitCode(username, values) {
        var result = await this.props.postForgotten(username, values.code);
        if (result) {
            this.setState({
                isModalOpen2: !this.state.isModalOpen2,
                isModalOpen3: !this.state.isModalOpen3
            })
        }

    }
    async handleSubmitPassword(username, values) {
        await this.props.postNewPassword(username, values.password);
        this.props.history.push('/login');
    }

    render() {
        return (
            <div className="container">
                <div className="row row-content" style={{boxShadow: "0 3px 10px 0 rgb(0 0 0 / 20%)", width: "40vw", paddingLeft: "0px", marginTop: "30px ", marginBottom: "30px"}}>
                    {this.state.isModalOpen1 && 
                        <div className="col-12 col-md-8 offset-2">
                            <h3 style={{fontWeight: 'bold', color: 'green'}}>C??i ?????t l???i m???t kh???u</h3>
                            <p>Nh???p t??n ng?????i d??ng c???a b???n. Ch??ng t??i s??? email cho b???n m???t li??n k???t ????? ????ng nh???p v?? ?????t l???i m???t kh???u c???a b???n.</p>
                        </div>
                    }
                    {this.state.isModalOpen2 && 
                        <div className="col-12 col-md-8 offset-2">
                            <h3 style={{fontWeight: 'bold', color: 'green'}}>Nh???p m?? x??c th???c</h3>
                        </div>
                    }
                    {this.state.isModalOpen3 && 
                        <div className="col-12 col-md-8 offset-2">
                            <h3 style={{fontWeight: 'bold', color: 'green'}}>?????t l???i m???t kh???u m???i</h3>
                        </div>
                    }
                    <div className="col-12 col-md-8 offset-2">

                        {this.state.isModalOpen1 &&
                            <LocalForm model="sendCode" onSubmit={(values) => this.handleSubmitUser(values)}>
                                <Row className="form-group">
                                    <Col md={10}>
                                        <Control.text model=".username" name="username"
                                            placeholder="Username"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                <Button type="submit" value="submit" color="success" className='col-12 col-md-4' style={{height: "40px", fontWeight: "bold", fontSize: "large"}}>G???i</Button>
                            </LocalForm>
                        }

                        {this.state.isModalOpen2 &&
                            <LocalForm model="forgotten" onSubmit={(values) => this.handleSubmitCode(this.state.username, values)}>
                                <Row className="form-group">
                                    <Col md={10}>
                                        <Control.text model=".code" name="code"
                                            placeholder="Code"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                {/* <Button type="submit" value="submit" color="primary">G???i m??</Button> */}
                                <Button type="submit" color="success">G???i m??</Button>

                            </LocalForm>
                        }

                        {this.state.isModalOpen3 &&
                            <LocalForm model="newPassword" onSubmit={(values) => this.handleSubmitPassword(this.state.username, values)}>
                                <Row className="form-group">
                                    <Col md={10}>
                                        <Control.text model=".password" name="password"
                                            placeholder="New Password"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                <Button type="submit" value="submit" color="success">L??u m???t kh???u</Button>
                            </LocalForm>
                        }

                    </div>
                </div>
            </div>
        )
    }

}

export default withRouter(connect(null, mapDispatchToProps)(Forgotten)); 