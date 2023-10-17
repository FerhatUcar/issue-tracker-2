"use client";
import { Button, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NewIssuesPage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root>
        <TextField.Input placeholder="title" />
      </TextField.Root>
      <SimpleMDE placeholder="Description" />
      <Button>Submit</Button>
    </div>
  );
};

export default NewIssuesPage;
