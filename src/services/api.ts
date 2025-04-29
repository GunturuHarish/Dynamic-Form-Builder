
import { FormResponse, User } from "../types/form";

const BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (userData: User): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create user" 
    };
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/get-form?rollNumber=${rollNumber}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch form");
    }

    const data: FormResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching form:", error);
    throw error;
  }
};
