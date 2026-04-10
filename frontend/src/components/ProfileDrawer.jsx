import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Spin,
  Space,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import api from '@/lib/api';

const ProfileDrawer = ({ open, onClose, onProfileUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/me");
      const userData = res.data.user;

      setUser(userData);
      setPreview(userData.profileImage || "");
      form.setFieldsValue({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "",
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open]);

  const handleUploadChange = (info) => {
    const selectedFile = info.file.originFileObj;
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async (values) => {
    try {
      setSaving(true);

      let imageUrl = user?.profileImage || "";

      if (file) {
        try {
          const formData = new FormData();
          formData.append("profileImage", file);

          const uploadRes = await api.post("/api/auth/upload-profile-image", formData);

          imageUrl = uploadRes.data.imageUrl;
          message.success("Image uploaded successfully");
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          message.error("Failed to upload image: " + (uploadError?.response?.data?.error || uploadError.message));
          return; // Don't proceed with profile update if upload failed
        }
      }

      const payload = {
        fullName: values.fullName,
        phone: values.phone,
        profileImage: imageUrl,
      };

      const res = await api.put("/api/auth/me", payload);

      message.success("Profile updated successfully");
      setUser(res.data.user);

      if (onProfileUpdated) {
        onProfileUpdated(res.data.user);
      }

      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      title="My Profile"
      placement="right"
      size="default"
      styles={{ body: { padding: 16 } }}
      style={{ width: 420 }} // 👈 custom width
      onClose={onClose}
      open={open}
      getContainer={false}
    >
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <Spin />
        </div>
      ) : (
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              size={96}
              src={preview || undefined}
              icon={!preview && <UserOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleUploadChange}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </div>
          </div>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input disabled />
          </Form.Item>

          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Update Profile
            </Button>
          </Space>
        </Form>
      )}
    </Drawer>
  );
};

export default ProfileDrawer;