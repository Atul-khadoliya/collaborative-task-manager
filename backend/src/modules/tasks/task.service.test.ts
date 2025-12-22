/**
 * @file task.service.test.ts
 * @description
 * Unit tests for the Task Service `createTask` function.
 *
 * These tests validate:
 * 1. Successful task creation with valid input
 * 2. Input validation failures (missing required fields)
 * 3. Side-effects such as assignment notifications
 *
 * All external dependencies (repository, notification service, socket emitter)
 * are mocked to isolate business logic.
 */

import { createTask } from "./task.service";
import * as taskRepo from "./task.repository";
import * as notificationService from "../notifications/notification.service";

// 🔴 Mock repository and side-effect services
jest.mock("./task.repository");
jest.mock("../notifications/notification.service");

// 🔴 Mock socket emitter to avoid real WebSocket usage in unit tests
jest.mock("../../server", () => ({
  emitToUser: jest.fn(),
}));

describe("Task Service – createTask", () => {
  /**
   * Valid RFC-compliant UUIDs used for testing.
   * Zod enforces UUID version + variant correctness,
   * so fake IDs like "user-1" are intentionally avoided.
   */
  const creatorId = "123e4567-e89b-12d3-a456-426614174000";
  const assigneeId = "223e4567-e89b-12d3-a456-426614174111";

  /**
   * Reset all mock calls and implementations
   * before each test to avoid test leakage.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task with valid input", async () => {
    /**
     * Arrange:
     * Mock repository response to simulate successful DB insert
     */
    (taskRepo.createTask as jest.Mock).mockResolvedValue({
      id: "323e4567-e89b-12d3-a456-426614174222",
      title: "Test Task",
      assignedToId: assigneeId,
    });

    /**
     * Act:
     * Call service with valid task payload
     */
    const task = await createTask(
      {
        title: "Test Task",
        description: "Test desc",
        dueDate: new Date().toISOString(),
        priority: "MEDIUM",
        status: "TODO",
        assignedToId: assigneeId,
      },
      creatorId
    );

    /**
     * Assert:
     * - Repository was called
     * - Assignment notification was triggered
     * - Returned task matches expected output
     */
    expect(taskRepo.createTask).toHaveBeenCalled();
    expect(notificationService.notifyTaskAssigned).toHaveBeenCalled();
    expect(task.id).toBe("323e4567-e89b-12d3-a456-426614174222");
  });

  it("should fail if assignedToId is missing", async () => {
    /**
     * Act & Assert:
     * Zod validation should reject missing `assignedToId`
     */
    await expect(
      createTask(
        {
          title: "Invalid Task",
          description: "Missing assignee",
          dueDate: new Date().toISOString(),
          priority: "LOW",
          status: "TODO",
        },
        creatorId
      )
    ).rejects.toBeTruthy();
  });

  it("should notify assigned user after task creation", async () => {
    /**
     * Arrange:
     * Mock repository to return a created task
     */
    (taskRepo.createTask as jest.Mock).mockResolvedValue({
      id: "423e4567-e89b-12d3-a456-426614174333",
      title: "Notify Task",
      assignedToId: assigneeId,
    });

    /**
     * Act:
     * Create task assigned to another user
     */
    await createTask(
      {
        title: "Notify Task",
        description: "Notify description",
        dueDate: new Date().toISOString(),
        priority: "HIGH",
        status: "TODO",
        assignedToId: assigneeId,
      },
      creatorId
    );

    /**
     * Assert:
     * Notification service is called with correct payload
     */
    expect(notificationService.notifyTaskAssigned).toHaveBeenCalledWith({
      userId: assigneeId,
      taskId: "423e4567-e89b-12d3-a456-426614174333",
      taskTitle: "Notify Task",
    });
  });
});
