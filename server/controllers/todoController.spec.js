const Todo = require("../models/Todo");
const todoController = require("../controllers/todoController");

jest.mock("../models/Todo");

describe("TodoController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTodos", () => {
    it("should get all todos with the specified userId", async () => {
      const mockedTodos = [
        { id: 1, task: "Todo 1", userId: "user123" },
        { id: 2, task: "Todo 2", userId: "user123" },
      ];
      const req = { query: { userId: "user123" } };
      const res = { json: jest.fn() };

      Todo.find.mockResolvedValue(mockedTodos);

      await todoController.getAllTodos(req, res);

      expect(Todo.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.json).toHaveBeenCalledWith(mockedTodos);
    });

    it("should handle server error", async () => {
      const req = { query: { userId: "user123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.find.mockRejectedValue(new Error("Server error"));

      await todoController.getAllTodos(req, res);

      expect(Todo.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("updateTodo", () => {
    it("should update a todo with the specified id", async () => {
      const req = {
        params: { id: "todo123" },
        body: {
          task: "Updated Todo",
          completed: true,
          completed_time: Date.now(),
        },
      };
      const res = { json: jest.fn() };

      const updatedTodo = {
        id: "todo123",
        task: "Updated Todo",
        completed: true,
        completed_time: Date.now(),
      };

      Todo.findByIdAndUpdate.mockResolvedValue(updatedTodo);

      await todoController.updateTodo(req, res);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        "todo123",
        {
          task: "Updated Todo",
          completed: true,
          completed_time: expect.any(Number),
        },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedTodo);
    });

    it("should handle server error", async () => {
      const req = {
        params: { id: "todo123" },
        body: {
          task: "Updated Todo",
          completed: true,
          completed_time: Date.now(),
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.findByIdAndUpdate.mockRejectedValue(new Error("Server error"));

      await todoController.updateTodo(req, res);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        "todo123",
        {
          task: "Updated Todo",
          completed: true,
          completed_time: expect.any(Number),
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo with the specified id", async () => {
      const req = { params: { id: "todo123" } };
      const res = { json: jest.fn() };

      await todoController.deleteTodo(req, res);

      expect(Todo.findOneAndDelete).toHaveBeenCalledWith({ _id: "todo123" });
      expect(res.json).toHaveBeenCalledWith({
        message: "Todo deleted successfully",
      });
    });

    it("should handle server error", async () => {
      const req = { params: { id: "todo123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.findOneAndDelete.mockRejectedValue(new Error("Server error"));

      await todoController.deleteTodo(req, res);

      expect(Todo.findOneAndDelete).toHaveBeenCalledWith({ _id: "todo123" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("deleteAllTodos", () => {
    it("should delete all todos with the specified userId", async () => {
      const req = { query: { userId: "user123" } };
      const res = { json: jest.fn() };

      await todoController.deleteAllTodos(req, res);

      expect(Todo.deleteMany).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.json).toHaveBeenCalledWith({
        message: "All todos deleted successfully",
        status: 200,
      });
    });

    it("should handle server error", async () => {
      const req = { query: { userId: "user123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Todo.deleteMany.mockRejectedValue(new Error("Server error"));

      await todoController.deleteAllTodos(req, res);

      expect(Todo.deleteMany).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
        status: 500,
      });
    });
  });
});
