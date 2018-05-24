export const getAlerts = (req, res) => {
  res.json([
    {
      id: '000000001',
      icon: 'question-circle-o',
      title: 'Warning',
      description: 'High temp',
      datetime: '2017-08-07',
      priority: 'low',
    },
    {
      id: '000000002',
      icon: 'exclamation-circle-o',
      title: 'Error',
      description: 'High temps',
      datetime: '2017-08-07',
      priority: 'medium',
    },
    {
      id: '000000003',
      icon: 'warning',
      title: 'Danger',
      description: 'Very high temps',
      datetime: '2017-08-07',
      priority: 'high',
    },
  ]);
};
export default {
  getAlerts,
};
