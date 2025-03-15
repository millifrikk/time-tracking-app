// src/components/OptionsManager.jsx
import React, { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OptionsManager = ({ onClose, initialCategories, initialSystems, initialTaskTypes, onSave }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [systems, setSystems] = useState(initialSystems);
  const [taskTypes, setTaskTypes] = useState(initialTaskTypes);
  
  const [newCategory, setNewCategory] = useState({ key: '', value: '' });
  const [newSystem, setNewSystem] = useState({ key: '', value: '' });
  const [newTaskType, setNewTaskType] = useState({ key: '', value: '' });

  const handleAddCategory = () => {
    if (newCategory.key.trim() === '' || newCategory.value.trim() === '') return;
    
    const key = newCategory.key.trim().toLowerCase().replace(/\s+/g, '-');
    setCategories({ ...categories, [key]: newCategory.value.trim() });
    setNewCategory({ key: '', value: '' });
  };

  const handleAddSystem = () => {
    if (newSystem.key.trim() === '' || newSystem.value.trim() === '') return;
    
    const key = newSystem.key.trim().toLowerCase().replace(/\s+/g, '-');
    setSystems({ ...systems, [key]: newSystem.value.trim() });
    setNewSystem({ key: '', value: '' });
  };

  const handleAddTaskType = () => {
    if (newTaskType.key.trim() === '' || newTaskType.value.trim() === '') return;
    
    const key = newTaskType.key.trim().toLowerCase().replace(/\s+/g, '-');
    setTaskTypes({ ...taskTypes, [key]: newTaskType.value.trim() });
    setNewTaskType({ key: '', value: '' });
  };

  const handleRemoveCategory = (keyToRemove) => {
    const updatedCategories = { ...categories };
    delete updatedCategories[keyToRemove];
    setCategories(updatedCategories);
  };

  const handleRemoveSystem = (keyToRemove) => {
    const updatedSystems = { ...systems };
    delete updatedSystems[keyToRemove];
    setSystems(updatedSystems);
  };

  const handleRemoveTaskType = (keyToRemove) => {
    const updatedTaskTypes = { ...taskTypes };
    delete updatedTaskTypes[keyToRemove];
    setTaskTypes(updatedTaskTypes);
  };

  const handleSaveOptions = () => {
    onSave({
      categories,
      systems,
      taskTypes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Dropdown Options</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="categories">
            <TabsList className="mb-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="systems">Systems</TabsTrigger>
              <TabsTrigger value="tasktypes">Task Types</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="ID (e.g. sap-bw)"
                    value={newCategory.key}
                    onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value })}
                  />
                  <Input 
                    placeholder="Display Name (e.g. SAP BW Implementation)"
                    value={newCategory.value}
                    onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {Object.entries(categories).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3">
                      <div>
                        <span className="font-mono text-sm text-gray-500 mr-2">{key}:</span>
                        <span>{value}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveCategory(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="systems">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="ID (e.g. uat)"
                    value={newSystem.key}
                    onChange={(e) => setNewSystem({ ...newSystem, key: e.target.value })}
                  />
                  <Input 
                    placeholder="Display Name (e.g. User Acceptance Testing)"
                    value={newSystem.value}
                    onChange={(e) => setNewSystem({ ...newSystem, value: e.target.value })}
                  />
                  <Button onClick={handleAddSystem}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {Object.entries(systems).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3">
                      <div>
                        <span className="font-mono text-sm text-gray-500 mr-2">{key}:</span>
                        <span>{value}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveSystem(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasktypes">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="ID (e.g. data-migration)"
                    value={newTaskType.key}
                    onChange={(e) => setNewTaskType({ ...newTaskType, key: e.target.value })}
                  />
                  <Input 
                    placeholder="Display Name (e.g. Data Migration)"
                    value={newTaskType.value}
                    onChange={(e) => setNewTaskType({ ...newTaskType, value: e.target.value })}
                  />
                  <Button onClick={handleAddTaskType}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {Object.entries(taskTypes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3">
                      <div>
                        <span className="font-mono text-sm text-gray-500 mr-2">{key}:</span>
                        <span>{value}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveTaskType(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSaveOptions}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptionsManager;