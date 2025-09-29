import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

interface ArrayEditorProps {
  value: { name: string; value: string }[];
  onChange: (value: { name: string; value: string }[]) => void;
}

export default function ArrayEditor({ value, onChange }: ArrayEditorProps) {
  const handleAdd = () => {
    onChange([...value, { name: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleChange = (
    index: number,
    field: "name" | "value",
    newValue: string
  ) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: newValue } : item
    );
    onChange(updated);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {value.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={item.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                  placeholder="Nome"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={item.value}
                  onChange={(e) =>
                    handleChange(index, "value", e.target.value)
                  }
                  placeholder="Valor"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  type="button"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleAdd} className="mt-2" type="button" size="sm">
        <Plus size={16} className="mr-2" />
        Adicionar
      </Button>
    </div>
  );
}