import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { useToast } from '../../hooks/useToast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  User,
  Users,
} from 'lucide-react';

const ScheduleOverview = () => {
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    clientId: '',
    date: '',
    startTime: '',
    endTime: '',
    recurring: false,
    recurrencePattern: '',
    notes: ''
  });

  useEffect(() => {
    fetchSchedules();
    fetchStaff();
    fetchClients();
  }, [currentDate]);

  const fetchSchedules = async () => {
    try {
      const startDate = format(startOfWeek(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfWeek(currentDate), 'yyyy-MM-dd');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/schedules?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch schedules',
        variant: 'error'
      });
    }
  };

  const fetchStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/staff`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch staff');
      const data = await response.json();
      console.log('Staff data:', data); // Debug log
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      addToast({
        title: 'Error',
        description: 'Failed to fetch staff members',
        variant: 'error'
      });
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/clients`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const method = selectedSchedule ? 'PUT' : 'POST';
      const url = selectedSchedule 
        ? `${process.env.REACT_APP_API_URL}/api/schedules/${selectedSchedule.id}`
        : `${process.env.REACT_APP_API_URL}/api/schedules`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save schedule');
      }

      addToast({
        title: 'Success',
        description: selectedSchedule ? 'Schedule updated' : 'Schedule created',
        variant: 'success'
      });

      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      addToast({
        title: 'Error',
        description: error.message,
        variant: 'error'
      });
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/schedules/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to delete schedule');

      addToast({
        title: 'Success',
        description: 'Schedule deleted successfully',
        variant: 'success'
      });

      fetchSchedules();
    } catch (error) {
      addToast({
        title: 'Error',
        description: error.message,
        variant: 'error'
      });
    }
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate)
  });

  const getSchedulesForDay = (date) => {
    return schedules.filter(schedule => 
      format(new Date(schedule.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-50 hover:bg-blue-100',
      completed: 'bg-green-50 hover:bg-green-100',
      cancelled: 'bg-red-50 hover:bg-red-100',
      missed: 'bg-yellow-50 hover:bg-yellow-100'
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Overview</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentDate(prev => subWeeks(prev, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">
            {format(startOfWeek(currentDate), 'MMM d')} - {format(endOfWeek(currentDate), 'MMM d, yyyy')}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(prev => addWeeks(prev, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button onClick={() => {
            setSelectedSchedule(null);
            setFormData({
              staffId: '',
              clientId: '',
              date: format(new Date(), 'yyyy-MM-dd'),
              startTime: '',
              endTime: '',
              recurring: false,
              recurrencePattern: '',
              notes: ''
            });
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toString()} className="min-h-[200px]">
            <div className="bg-gray-50 p-2 rounded-t-lg">
              <h3 className="font-medium text-gray-700">
                {format(day, 'EEE')}
              </h3>
              <p className="text-sm text-gray-500">
                {format(day, 'MMM d')}
              </p>
            </div>
            <div className="border rounded-b-lg p-2 space-y-2">
              {getSchedulesForDay(day).map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-2 rounded-lg cursor-pointer text-sm ${getStatusColor(schedule.status)}`}
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    setFormData({
                      staffId: schedule.staff_id,
                      clientId: schedule.client_id,
                      date: schedule.date,
                      startTime: schedule.start_time,
                      endTime: schedule.end_time,
                      recurring: schedule.recurring,
                      recurrencePattern: schedule.recurrence_pattern,
                      notes: schedule.notes
                    });
                    setShowModal(true);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">
                      {format(new Date(`2000-01-01T${schedule.start_time}`), 'h:mm a')}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                      {schedule.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {schedule.staff_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {schedule.client_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>
              {selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveSchedule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Staff Member *</label>
                <Select
                  value={formData.staffId}
                  onValueChange={(value) => setFormData({ ...formData, staffId: value })}
                >
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Client *</label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.first_name} {c.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Time *</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Time *</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about this schedule..."
              />
            </div>

            {selectedSchedule && (
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={selectedSchedule.status}
                  onValueChange={(value) => setSelectedSchedule({ ...selectedSchedule, status: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              {selectedSchedule && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteSchedule(selectedSchedule.id)}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedSchedule ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleOverview;