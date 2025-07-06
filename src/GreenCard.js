import React, { useState } from 'react';
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
      console.log('Saved to Firestore!');
    } catch (e) {
      console.error('Error saving: ', e);
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
    <div style={{ minHeight: '100vh', background: '#f4f4f4', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#047857' }}>GreenCard Generator</h1>

      <form style={{ maxWidth: 600, margin: '1rem auto', display: 'grid', gap: '1rem' }}>
        <div>
          <input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name}</p>}
        </div>

        <input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
        <input placeholder="Company" name="company" value={form.company} onChange={handleChange} />
        <input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />

        <div>
          <input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</p>}
        </div>

        <input placeholder="Website" name="website" value={form.website} onChange={handleChange} />

        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '1rem', background: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#065f46' }}>{form.name}</h2>
          <p>{form.title} at {form.company}</p>
          <p>{form.email}</p>
          <p>{form.phone}</p>
          <a href={form.website} target="_blank" rel="noreferrer">{form.website}</a>
          <div style={{ marginTop: '1rem' }}>
            <QRCodeSVG value={cardUrl} size={100} />
          </div>
        </div>

        <button
          type="button"
          onClick={downloadAndSave}
          style={{ width: '100%', background: '#047857', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem', border: 'none' }}
        >
          Save & Download Digital Card
        </button>
      </form>
    </div>
  );
};

export default GreenCard;
