"use client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

const NewIssuesPage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root>
        <TextField.Input placeholder="title" />
      </TextField.Root>
      <TextArea size="1" placeholder="Description" />
      <Button>Submit</Button>
    </div>
  );
};

export default NewIssuesPage;
