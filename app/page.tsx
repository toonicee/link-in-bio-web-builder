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
  Avatar,
} from "antd";
import { useWebsiteStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  PlusSquareOutlined,
  MinusCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DragOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Camera } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  
} from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";

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

  const [sections, setSections] = useState<
    {
      id: string;
      title: string;
      link: string;
      labelTitle: string;
      labelLink: string;
    }[]
  >([
    {
      id: "section-1",
      title: "",
      link: "",
      labelTitle: "Title",
      labelLink: "Link",
    },
  ]);

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

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section-${sections.length + 1}`, // Ensure unique ID
        title: "",
        link: "",
        labelTitle: "Title",
        labelLink: "Link",
      },
    ]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Title level={1} className="text-center mb-8 ">
            Bio Link
          </Title>

          <Card className="w-full shadow-sm">
            <Form
              layout="vertical"
              onFinish={handlePreview}
              className="space-y-6"
              requiredMark={false}
            >
              <Form.Item label="Profile" name="image">
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <Upload {...uploadProps} showUploadList={false}>
                      <div className="cursor-pointer relative group">
                        <Avatar
                          size={80}
                          src={
                            imageUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          className="border-4 border-white"
                        />
                        <Button
                          shape="circle"
                          size="small"
                          className="absolute bottom-0 right-0 bg-white"
                          icon={<Camera size={16} />}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <EditOutlined className="text-white text-lg" />
                        </div>
                      </div>
                    </Upload>
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter Title!" }]}
              >
                <Input placeholder="Enter Title" />
              </Form.Item>

              <Form.Item
                label="About You"
                name="About"
                rules={[{ required: true, message: "Please enter About You!" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Enter About You"
                  maxLength={80}
                  showCount
                />
              </Form.Item>

              <Form.Item label="Social Link">
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
                  icon={<PlusSquareOutlined />}
                ></Button>
              </Form.Item>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 p-4 border rounded-lg"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <DragOutlined className="text-gray-400 cursor-move" />
                                </div>
                                <Button
                                  type="text"
                                  danger
                                  onClick={() => {
                                    const newSections = sections.filter(
                                      (s) => s.id !== section.id
                                    );
                                    setSections(newSections);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                              {/* Rest of your section content */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button
                type="dashed"
                onClick={addSection}
                block
                icon={<PlusOutlined />}
              >
                Add Section
              </Button>

              <Form.Item className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  className="bg-primary hover:bg-secondary text-white flex items-center justify-center gap-2 shadow-lg px-12 font-bold"
                  icon={<EyeOutlined />}
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
