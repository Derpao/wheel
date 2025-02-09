import { useState } from 'react';

interface UpdateSpinsFormProps {
  tableName: string;
  onUpdate: (phoneNumber: string, spins: number) => Promise<void>;
}

export default function UpdateSpinsForm({ tableName, onUpdate }: UpdateSpinsFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newSpins, setNewSpins] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage(''); // Clear previous message
    
    try {
      // Enhanced validation
      if (!/^[0-9]{10}$/.test(phoneNumber)) {
        setUpdateMessage('❌ เบอร์โทรต้องเป็นตัวเลข 10 หลัก');
        return;
      }
  
      const spinsNum = parseInt(newSpins);
      if (isNaN(spinsNum) || spinsNum < 0 || spinsNum > 999999) {
        setUpdateMessage('❌ จำนวนรอบหมุนต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0');
        return;
      }

      await onUpdate(phoneNumber, spinsNum);
      setUpdateMessage('✅ อัพเดทสำเร็จ');
      setPhoneNumber('');
      setNewSpins('');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'โปรดลองใหม่อีกครั้ง';
      setUpdateMessage(`❌ เกิดข้อผิดพลาด: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value !== e.target.value) {
              setUpdateMessage('❌ กรุณากรอกเฉพาะตัวเลขเท่านั้น');
              setTimeout(() => setUpdateMessage(''), 2000); // Clear message after 2 seconds
            }
            setPhoneNumber(value);
          }}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          pattern="[0-9]*"
          inputMode="numeric"
          placeholder="เบอร์โทรศัพท์"
          className="flex-1 p-2 border rounded text-black"
          maxLength={10}
          required
        />
        <input
          type="number"
          value={newSpins}
          onChange={(e) => setNewSpins(e.target.value)}
          placeholder="จำนวนรอบหมุน"
          className="flex-1 p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
        >
          อัพเดทรอบหมุน {tableName}
        </button>
      </div>
      {updateMessage && (
        <p className="mt-2 text-sm font-medium">
          {updateMessage}
        </p>
      )}
    </form>
  );
}