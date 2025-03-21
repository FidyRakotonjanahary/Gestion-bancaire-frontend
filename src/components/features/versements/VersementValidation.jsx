const VersementValidation = ({ versementId, onValidated }) => {
    const { showAlert } = useAlertContext();
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState(null);
  
    const handleValidate = async () => {
      try {
        setValidating(true);
        setError(null);
        await validateVersement(versementId);
        showAlert('Versement validé avec succès', 'success');
        if (onValidated) onValidated();
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        setError(error.response?.data?.message || 'Erreur lors de la validation');
        showAlert('Erreur lors de la validation du versement', 'error');
      } finally {
        setValidating(false);
      }
    };
  
    return (
      <Card className="w-full p-6 border-l-4 border-yellow-500">
        <h3 className="text-lg font-medium mb-2">Validation du Versement</h3>
        
        <p className="mb-4">
          Ce versement est en attente de validation. Une fois validé, le solde du client
          sera mis à jour et l'opération ne pourra plus être annulée.
        </p>
  
        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}
  
        <Button
          variant="warning"
          onClick={handleValidate}
          loading={validating}
          disabled={validating}
          className="w-full sm:w-auto"
        >
          Valider le Versement
        </Button>
      </Card>
    );
  };
  
  export default VersementValidation;