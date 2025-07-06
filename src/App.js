import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const App = () => {
  const [form, setForm] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cardUrl = `https://oncallservices.ai/card/${encodeURIComponent(form.name)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#047857' }}>SustainaCard Generator</h1>

      <div style={{ maxWidth: 600, margin: '1rem auto', display: 'grid', gap: '1rem' }}>
        <input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
        <input placeholder="Title" name="title" value={form.title} onChange={handleChange} />
        <input placeholder="Company" name="company" value={form.company} onChange={handleChange} />
        <input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
        <input placeholder="Website" name="website" value={form.website} onChange={handleChange} />

        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '1rem', background: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#065f46' }}>{form.name}</h2>
          <p>{form.title} at {form.company}</p>
          <p>{form.email}</p>
          <p>{form.phone}</p>
          <p><a href={form.website} target="_blank" rel="noreferrer">{form.website}</a></p>
          <div style={{ marginTop: '1rem' }}>
            <QRCodeSVG value={cardUrl} size={100} />
          </div>
        </div>

        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(form))}`}
          download="sustainacard.json"
        >
          <button style={{ width: '100%', background: '#047857', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem' }}>
            Download Digital Card
          </button>
        </a>
      </div>
    </div>
  );
};

export default App;
