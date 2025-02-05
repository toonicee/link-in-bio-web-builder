"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  UploadProps,
  message,
  Spin,
} from "antd";
import { useWebsiteStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export default function Home() {
  const router = useRouter();
  const { setTitle, setImageUrl, setContent, setFooter, imageUrl } =
    useWebsiteStore();

  const [socialMediaFields, setSocialMediaFields] = useState([{ id: 0 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const savedImage = localStorage.getItem("uploadedImage");
    if (savedImage) {
      setImageUrl(savedImage);
    }
    setIsPageLoading(false);
  }, [setImageUrl]);

  const addSocialMediaField = () => {
    setSocialMediaFields([
      ...socialMediaFields,
      { id: socialMediaFields.length },
    ]);
  };

  const removeSocialMediaField = (id: number) => {
    setSocialMediaFields(socialMediaFields.filter((field) => field.id !== id));
  };

  const handlePreview = async (values: any) => {
    setIsLoading(true);
    setTitle(values.title);
    setImageUrl(values.image);
    setContent(values.content);
    setFooter(values.footer);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push("/preview");
    setIsLoading(false);
  };

  const uploadProps: UploadProps = {
    name: "file",
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        localStorage.setItem("uploadedImage", base64Image);
        setImageUrl(base64Image);
        message.success("Image uploaded successfully!");
      };

      return false;
    },
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Title level={1} className="text-center mb-8">
            Bio Link
          </Title>

          <Card className="w-full shadow-sm">
            <Form
              layout="vertical"
              onFinish={handlePreview}
              className="space-y-6"
            >
              <Form.Item
                label="Picture"
                name="image"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <div className="flex flex-col items-center space-y-4">
                  <Upload
                    {...uploadProps}
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                  >
                    {imageUrl ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={imageUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="text-white text-center">
                            <EditOutlined className="text-lg" />
                            <div className="text-xs mt-1">Update</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  {imageUrl && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        setImageUrl("");
                        localStorage.removeItem("uploadedImage");
                        message.success("Image removed successfully!");
                      }}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter the title!" }]}
              >
                <Input placeholder="Enter page title" />
              </Form.Item>

              <Form.Item
                label="About You"
                name="About"
                rules={[{ required: true, message: "Please enter About You!" }]}
              >
                <TextArea rows={6} placeholder="Enter About You" />
              </Form.Item>

              <Form.Item label="Social Media Links">
                {socialMediaFields.map((field) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <Form.Item
                      name={`socialMedia-${field.id}`}
                      rules={[
                        {
                          required: true,
                          message: "Please enter social media link!",
                        },
                        {
                          type: "url",
                          message:
                            "Please enter a valid URL starting with https://",
                        },
                        {
                          pattern: new RegExp("^https://"),
                          message: "URL must start with https://",
                        },
                      ]}
                      className="mb-0 w-full"
                    >
                      <Input placeholder="https://example.com" type="url" />
                    </Form.Item>
                    {field.id > 0 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeSocialMediaField(field.id)}
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={addSocialMediaField}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Social Media
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  className="bg-blue-500 hover:bg-blue-500"
                >
                  {isLoading ? "Loading..." : "Preview"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
