// GreenCard Agent: Premium Digital Business Card Platform

import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const GreenCard = () => {
  const [form, setForm] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    if (name === 'name' && value.trim() === '') {
      setErrors((prev) => ({ ...prev, name: 'Name is required' }));
    } else if (name === 'email') {
      if (value.trim() === '') {
        setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
      } else {
        setErrors((prev) => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    } else {
      setErrors((prev) => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const saveToFirebase = async () => {
    try {
      await addDoc(collection(db, 'greencards'), form);
      console.log('Card saved to Firestore!');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const downloadAndSave = async () => {
    await saveToFirebase();
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(form))}`;
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = 'green-card.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardUrl = `https://oncallservices.ai/card/${encodeURIComponent(form.name)}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-green-700">GreenCard Generator</h1>

      <form className="w-full max-w-xl grid gap-4">
        <div>
          <Input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <Input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
        <Input placeholder="Company" name="company" value={form.company} onChange={handleChange} />
        <Input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />

        <div>
          <Input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <Input placeholder="Website" name="website" value={form.website} onChange={handleChange} />

        <Card className="mt-4 bg-white border shadow-xl rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800">{form.name}</h2>
            <p className="text-sm text-gray-600">{form.title} at {form.company}</p>
            <p className="text-sm text-gray-600">{form.email}</p>
            <p className="text-sm text-gray-600">{form.phone}</p>
            <p className="text-sm text-blue-600 underline">{form.website}</p>
            <div className="mt-4">
              <QRCodeSVG value={cardUrl} size={100} />
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={downloadAndSave}
          type="button"
        >
          Save & Download Digital Card
        </Button>
      </form>

      <style jsx>{`
        @media (max-width: 640px) {
          form {
            padding: 1rem;
          }

          .text-xl {
            font-size: 1.125rem;
          }

          .p-6 {
            padding: 1rem;
          }

          .mt-4 {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GreenCard;