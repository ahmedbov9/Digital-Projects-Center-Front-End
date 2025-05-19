import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const RejectOfferModal = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // إعادة تعيين الحالة عند فتح المودال
  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('الرجاء كتابة سبب الرفض');
      return;
    }
    setError('');
    onSubmit(reason);
    // لا تمسح السبب أو تغلق المودال هنا، اترك الأمر للوالد حسب نجاح العملية
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="reject-offer-title">
      <Box sx={style}>
        <Typography id="reject-offer-title" variant="h6" mb={2}>
          سبب رفض العرض
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="اكتب السبب هنا"
          multiline
          rows={4}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="error">
            تأكيد الرفض
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

RejectOfferModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RejectOfferModal;
