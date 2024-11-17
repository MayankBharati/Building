import React, { useState, useEffect } from 'react';
import {
  Button, Input, Table, Badge, Card, Form, Typography, Space, Spin, Row, Col, message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, LikeOutlined, DislikeOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

// Simulated AI response generation
const generateAIResponse = async (email, prompt) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `AI Response to "${email.subject}": ${prompt} ${email.body.substring(0, 50)}...`;
};

// Simulated email sending
const sendEmail = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  message.success(`Email sent to ${email.sender}`);
};

export default function EmailAISystem() {
  const [emails, setEmails] = useState([]);
  const [metrics, setMetrics] = useState({ totalEmails: 0, responseRate: 0, averageResponseTime: 0 });
  const [aiPrompt, setAiPrompt] = useState("Generate a polite and helpful response for this email:");
  const [isRefining, setIsRefining] = useState(false);
  const [newEmail, setNewEmail] = useState({ sender: '', subject: '', body: '' });

  useEffect(() => {
    const processEmails = async () => {
      for (const email of emails) {
        if (email.status === 'Pending' && !email.aiResponse) {
          const response = await generateAIResponse(email, aiPrompt);
          setEmails(prevEmails => prevEmails.map(e => 
            e.id === email.id ? { ...e, aiResponse: response, status: 'Sent' } : e
          ));
          await sendEmail({ ...email, aiResponse: response });
        }
      }
    };
    processEmails();
  }, [emails, aiPrompt]);

  useEffect(() => {
    const sentEmails = emails.filter(e => e.status === 'Sent');
    setMetrics({
      totalEmails: emails.length,
      responseRate: emails.length ? (sentEmails.length / emails.length) * 100 : 0,
      averageResponseTime: sentEmails.length ? 2.3 : 0,
    });
  }, [emails]);

  const handleRefineAI = () => {
    setIsRefining(true);
    setTimeout(() => {
      setIsRefining(false);
    }, 2000);
  };

  const handleNewEmail = () => {
    const newEmailObj = {
      id: emails.length + 1,
      ...newEmail,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };
    setEmails(prevEmails => [...prevEmails, newEmailObj]);
    setNewEmail({ sender: '', subject: '', body: '' });
  };

  const columns = [
    { title: 'Sender', dataIndex: 'sender', key: 'sender' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'AI Response',
      dataIndex: 'aiResponse',
      key: 'aiResponse',
      render: (text) => <span>{text || 'Generating...'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'Sent' ? 'success' : 'default'}
          text={status}
        />
      ),
    },
    {
      title: 'Feedback',
      key: 'feedback',
      render: () => (
        <Space>
          <Button icon={<LikeOutlined />} size="small" />
          <Button icon={<DislikeOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Email AI Management System</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Emails Processed">
            <Title level={3}>{metrics.totalEmails}</Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Response Rate">
            <Title level={3}>{metrics.responseRate.toFixed(1)}%</Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Average Response Time">
            <Title level={3}>{metrics.averageResponseTime.toFixed(1)} min</Title>
          </Card>
        </Col>
      </Row>

      <Card title="Simulate New Email" style={{ marginTop: '20px' }}>
        <Form layout="vertical" onFinish={handleNewEmail}>
          <Form.Item label="Sender" required>
            <Input
              value={newEmail.sender}
              onChange={(e) => setNewEmail({ ...newEmail, sender: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Subject" required>
            <Input
              value={newEmail.subject}
              onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Email Body" required>
            <TextArea
              value={newEmail.body}
              onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
              rows={4}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
            Send Email
          </Button>
        </Form>
      </Card>

      <Card title="Recent Emails" style={{ marginTop: '20px' }}>
        <Table dataSource={emails} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Card title="Refine AI Prompt" style={{ marginTop: '20px' }}>
        <TextArea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={3}
        />
        <Button
          type="primary"
          icon={isRefining ? <Spin indicator={<ReloadOutlined spin />} /> : <ReloadOutlined />}
          onClick={handleRefineAI}
          style={{ marginTop: '10px' }}
          disabled={isRefining}
        >
          {isRefining ? 'Refining...' : 'Refine AI Prompt'}
        </Button>
      </Card>
    </div>
  );
}
