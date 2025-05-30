
import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr, enUS, th } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePlats, useCreateEvenement } from '@/hooks/useAirtable';
import { useTranslation } from 'react-i18next';

const Evenements = memo(() => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { plats, isLoading: platsLoading } = usePlats();
  const createEvenement = useCreateEvenement();
  const [dateEvenement, setDateEvenement] = useState<Date>();
  const [platsPreselectionnes, setPlatsPreselectionnes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    nomEvenement: '',
    contactEmail: '',
    typeEvenement: '',
    nombrePersonnes: '',
    budgetClient: '',
    demandesSpeciales: ''
  });

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'th': return th;
      default: return fr;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatPreselectionneChange = (platId: string, checked: boolean) => {
    setPlatsPreselectionnes(prev => {
      if (checked) {
        return [...prev, platId];
      } else {
        return prev.filter(id => id !== platId);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateEvenement) {
      toast({
        title: t('events.toasts.missingDate'),
        variant: "destructive",
      });
      return;
    }

    try {
      await createEvenement.mutateAsync({
        ...formData,
        dateEvenement: dateEvenement.toISOString(),
        platsPreSelectionnes: platsPreselectionnes,
        nombrePersonnes: parseInt(formData.nombrePersonnes),
        budgetClient: parseFloat(formData.budgetClient)
      });
      
      toast({
        title: t('events.toasts.success'),
      });
      
      // Reset form
      setFormData({
        nomEvenement: '',
        contactEmail: '',
        typeEvenement: '',
        nombrePersonnes: '',
        budgetClient: '',
        demandesSpeciales: ''
      });
      setDateEvenement(undefined);
      setPlatsPreselectionnes([]);
      
    } catch (error) {
      toast({
        title: t('events.toasts.error'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-thai py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border-thai-orange/20">
          <CardHeader className="text-center bg-gradient-to-r from-thai-orange to-thai-gold text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 mr-2" />
              <CardTitle className="text-3xl font-bold">{t('events.title')}</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              {t('events.subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom de l'événement */}
              <div className="space-y-2">
                <Label htmlFor="nomEvenement" className="text-thai-green font-medium">
                  {t('events.form.eventName')} {t('common.required')}
                </Label>
                <Input
                  id="nomEvenement"
                  value={formData.nomEvenement}
                  onChange={(e) => handleInputChange('nomEvenement', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Email contact */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-thai-green font-medium">
                  {t('events.form.contactEmail')} {t('common.required')}
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Type d'événement */}
              <div className="space-y-2">
                <Label htmlFor="typeEvenement" className="text-thai-green font-medium">
                  {t('events.form.eventType')} {t('common.required')}
                </Label>
                <Select value={formData.typeEvenement} onValueChange={(value) => handleInputChange('typeEvenement', value)}>
                  <SelectTrigger className="w-full border-thai-orange/30 focus:border-thai-orange">
                    <SelectValue placeholder={t('events.form.selectType')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="mariage">{t('events.eventTypes.wedding')}</SelectItem>
                    <SelectItem value="anniversaire">{t('events.eventTypes.birthday')}</SelectItem>
                    <SelectItem value="reunion">{t('events.eventTypes.meeting')}</SelectItem>
                    <SelectItem value="autre">{t('events.eventTypes.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date de l'événement */}
              <div className="space-y-2">
                <Label className="text-thai-green font-medium">
                  {t('events.form.eventDate')} {t('common.required')}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-thai-orange/30",
                        !dateEvenement && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateEvenement ? format(dateEvenement, "PPP", { locale: getDateLocale() }) : t('events.form.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={dateEvenement}
                      onSelect={setDateEvenement}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Nombre de personnes */}
              <div className="space-y-2">
                <Label htmlFor="nombrePersonnes" className="text-thai-green font-medium">
                  {t('events.form.guestCount')} {t('common.required')}
                </Label>
                <Input
                  id="nombrePersonnes"
                  type="number"
                  value={formData.nombrePersonnes}
                  onChange={(e) => handleInputChange('nombrePersonnes', e.target.value)}
                  required
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Budget du client */}
              <div className="space-y-2">
                <Label htmlFor="budgetClient" className="text-thai-green font-medium">
                  {t('events.form.budget')}
                </Label>
                <Input
                  id="budgetClient"
                  type="number"
                  value={formData.budgetClient}
                  onChange={(e) => handleInputChange('budgetClient', e.target.value)}
                  placeholder={t('events.form.budgetPlaceholder')}
                  className="border-thai-orange/30 focus:border-thai-orange"
                />
              </div>

              {/* Plats présélectionnés */}
              <div className="space-y-3">
                <Label className="text-thai-green font-medium">{t('events.form.preSelectedDishes')}</Label>
                {platsLoading ? (
                  <p className="text-thai-green/70">{t('common.loading')}</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {plats?.map(plat => (
                      <div key={plat.id} className="flex items-center space-x-2">
                        <Input
                          type="checkbox"
                          id={`plat-${plat.id}`}
                          checked={platsPreselectionnes.includes(plat.id)}
                          onChange={(e) => handlePlatPreselectionneChange(plat.id, e.target.checked)}
                          className="border-thai-orange data-[state=checked]:bg-thai-orange"
                        />
                        <Label htmlFor={`plat-${plat.id}`} className="text-sm text-thai-green">
                          {plat.plat}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Demandes spéciales */}
              <div className="space-y-2">
                <Label htmlFor="demandesSpeciales" className="text-thai-green font-medium">
                  {t('events.form.specialRequests')}
                </Label>
                <Textarea
                  id="demandesSpeciales"
                  value={formData.demandesSpeciales}
                  onChange={(e) => handleInputChange('demandesSpeciales', e.target.value)}
                  rows={3}
                  className="border-thai-orange/30 focus:border-thai-orange"
                  placeholder={t('events.form.specialRequestsPlaceholder')}
                />
              </div>

              <Button 
                type="submit" 
                disabled={createEvenement.isPending || !formData.nomEvenement || !formData.contactEmail || !formData.typeEvenement || !dateEvenement}
                className="w-full bg-thai-orange hover:bg-thai-orange-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createEvenement.isPending ? t('events.form.sending') : t('events.form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Evenements.displayName = 'Evenements';

export default Evenements;
