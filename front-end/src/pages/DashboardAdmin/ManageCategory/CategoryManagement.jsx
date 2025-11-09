import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Space,
    Popconfirm,
    Card,
    Spin,
    Typography
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import categoryService from '../../../services/api/CategoryService';

const { Title } = Typography;

const CategoryManagement = () => {
    // State declarations
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            message.error('Failed to fetch categories: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle category creation/update
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (editingId) {
                // Update existing category
                await categoryService.updateCategory(editingId, values);
                message.success('Category updated successfully');
            } else {
                // Create new category
                await categoryService.createCategory(values);
                message.success('Category created successfully');
            }
            setModalVisible(false);
            form.resetFields();
            fetchCategories();
        } catch (error) {
            message.error('Operation failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle category deletion
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            const response = await categoryService.deleteCategory(id);
            if (response.success) {
                message.success(response.message || 'Category deleted successfully');
                fetchCategories(); // Refresh the list
            } else {
                message.error(response.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error(error.message || 'Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    // Handle search
    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value) {
            try {
                setLoading(true);
                const results = await categoryService.searchCategories(value);
                setCategories(results);
            } catch (error) {
                message.error('Search failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            fetchCategories();
        }
    };

    // Table columns configuration
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white'
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={2}>Category Management</Title>

                {/* Search and Add button */}
                <Space style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="Search categories"
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingId(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white'
                        }}
                    >
                        Add Category
                    </Button>
                </Space>

                {/* Categories Table */}
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={categories}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} categories`
                        }}
                    />
                </Spin>

                {/* Create/Edit Modal */}
                <Modal
                    title={editingId ? 'Edit Category' : 'Create Category'}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="name"
                            label="Category Name"
                            rules={[
                                { required: true, message: 'Please input the category name!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        backgroundColor: '#1890ff',
                                        color: 'white'
                                    }}
                                >
                                    {editingId ? 'Update' : 'Create'}
                                </Button>
                                <Button onClick={() => {
                                    setModalVisible(false);
                                    form.resetFields();
                                }}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </Card>
    );
};

export default CategoryManagement;