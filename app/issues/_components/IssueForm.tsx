import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Button, Callout, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import { useState } from "react";

type IssueForm = {
  title: string;
  description: string;
};
const IssueForm = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (err) {
      setError("Error occurred");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="title" {...register("title")} />
        </TextField.Root>
        <Controller
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
          control={control}
          name="description"
        />

        <Button>Submit</Button>
      </form>
    </div>
  );
};

export default IssueForm;
