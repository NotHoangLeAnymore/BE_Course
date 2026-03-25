import type { Response } from "express";
import Blog from "../models/Blog";
import { AuthRequest } from "../middleware/auth";

export async function createBlog(req: AuthRequest, res: Response) {
  try {
    const { title, content } = req.body as { title: string; content: string };
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title và content chưa được điền" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      author: req.userId,
    });

    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi tạo bài viết" });
  }
}

// list blogs
export async function listBlogs(req: AuthRequest, res: Response) {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi lấy danh sách bài viết" });
  }
}

// Get blog by ID
export async function getBlog(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id).populate("author", "name email");
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi không tìm thấy bài viết" });
  }
}

// Update Blog
export async function updateBlog(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    if (blog.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa bài viết này" });
    }

    const { title, content } = req.body as { title: string; content: string };
    if (typeof title === "string") blog.title = title;
    if (typeof content === "string") blog.content = content;
    if (req.file) {
      blog.imageUrl = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi không thể cập nhật bài viết" });
  }
}

// Delete Blog
export async function deleteBlog(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    if (blog.author.toString() !== req.userId)
      return res.status(403).json({ message: "Forbidden" });
    await blog.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete blog" });
  }
}

export default { createBlog, listBlogs, getBlog, updateBlog, deleteBlog };
