
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createUser, getForm } from "@/services/api";
import { useFormContext } from "@/context/FormContext";
import { User } from "@/types/form";

const Login: React.FC = () => {
  const [formState, setFormState] = useState<User>({ rollNumber: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser, setFormResponse } = useFormContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formState.rollNumber.trim() || !formState.name.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Create user
      const result = await createUser(formState);
      
      if (!result.success) {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch form
      const formResponse = await getForm(formState.rollNumber);
      
      // Set context
      setUser(formState);
      setFormResponse(formResponse);
      
      toast({
        title: "Success",
        description: "Login successful",
      });
      
      // Navigate to form
      navigate("/form");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-student-background p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Student Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to access your forms</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={formState.rollNumber}
                onChange={handleChange}
                required
                data-testid="roll-number-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formState.name}
                onChange={handleChange}
                required
                data-testid="name-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-student-primary hover:bg-student-accent"
              disabled={isLoading}
              data-testid="login-button"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
