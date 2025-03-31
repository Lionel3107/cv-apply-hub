
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Clock, Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

export const CompanyDashboardTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review job applications",
      dueDate: "2023-11-15",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Schedule interviews",
      dueDate: "2023-11-18",
      status: "pending",
      priority: "medium",
    },
    {
      id: "3",
      title: "Update job description",
      dueDate: "2023-11-20",
      status: "completed",
      priority: "low",
    },
    {
      id: "4",
      title: "Team meeting for hiring",
      dueDate: "2023-11-22",
      status: "pending",
      priority: "high",
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [isAdding, setIsAdding] = useState(false);

  const addTask = () => {
    if (newTask.trim() === "") return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      status: "pending",
      priority: newPriority,
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
    setNewDueDate("");
    setIsAdding(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Management</h2>
        {!isAdding && (
          <Button
            className="bg-brand-blue hover:bg-brand-darkBlue"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Task title"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button className="bg-brand-blue hover:bg-brand-darkBlue" onClick={addTask}>
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "pending")
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "pending").length === 0 && (
                <div className="text-center py-4 text-gray-500">No pending tasks</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === "completed")
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium line-through text-gray-500">{task.title}</div>
                      <div className="text-sm text-gray-400 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTaskStatus(task.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === "completed").length === 0 && (
                <div className="text-center py-4 text-gray-500">No completed tasks</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
