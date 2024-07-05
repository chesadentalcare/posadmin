import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Layout, Row, Col, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../ContextAPI/AuthContext';
import './login.css';

const { Content, Footer } = Layout;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const credentials = {
        username: values.username,
        password: values.password,
      };
      await login(credentials, navigate);
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      className="layout"
      style={{
        backgroundImage: 'url("https://chesadentalcare.com/assets/img/bnr/admin.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src="https://chesadentalcare.com/assets/img/logo.png"
        style={{ height: '170px', width: '250px', position: 'absolute' }}
        alt="Logo"
      />
      <Row>
        <Col
          span={12}
          offset={12}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Content
            style={{
              maxWidth: '390px',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="logistics">
              <h2>ADMIN DASHBOARD</h2>
            </div>
            <Divider />
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="logistic@demo.com"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="123456"
                  autoComplete="off"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Col>
      </Row>
      <Footer style={{ textAlign: 'center' }}>&copy; Production Dashboard built by CHESA DENTAL CARE</Footer>
    </Layout>
  );
};

export default LoginPage;
