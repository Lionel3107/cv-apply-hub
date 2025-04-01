
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUp, X } from "lucide-react";

interface ResumeUploadProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  fileError: string | null;
  setFileError: (error: string | null) => void;
}

const ResumeUpload = ({ 
  resumeFile, 
  setResumeFile, 
  fileError, 
  setFileError 
}: ResumeUploadProps) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setFileError("Only PDF files are accepted. Please upload a PDF file.");
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File is too large. Maximum size is 5MB.");
        return;
      }
      
      setResumeFile(file);
    }
  };
  
  const removeFile = () => {
    setResumeFile(null);
    setFileError(null);
  };
  
  return (
    <div>
      <Label htmlFor="resume">Resume/CV (PDF only) *</Label>
      {resumeFile ? (
        <div className="flex items-center p-3 border rounded-md bg-gray-50">
          <div className="flex-1 truncate">
            {resumeFile.name}
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={removeFile}
          >
            <X size={18} />
          </Button>
        </div>
      ) : (
        <div className="mt-1">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue"
            onClick={() => document.getElementById("resume")?.click()}
          >
            <FileUp className="mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF files only, up to 5MB</p>
          </div>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
            required
          />
        </div>
      )}
      {fileError && (
        <p className="text-sm text-red-500 mt-1">{fileError}</p>
      )}
    </div>
  );
};

export default ResumeUpload;
