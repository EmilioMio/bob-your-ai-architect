import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Users, Calendar, Target, Laptop, Settings, Rocket, AlertCircle } from 'lucide-react';
import { ProjectFormData } from './types';
import { validateProject } from '@/lib/bob-ai';

const teamSizeOptions = [
  { value: 'solo', label: 'Solo developer', icon: '👤' },
  { value: '2-5', label: '2-5 people', icon: '👥' },
  { value: '6-10', label: '6-10 people', icon: '👥' },
  { value: '11-50', label: '11-50 people', icon: '🏢' },
  { value: '50+', label: '50+ people', icon: '🏛️' },
];

const timelineOptions = [
  { value: 'week', label: 'This week', icon: '⚡' },
  { value: '2-4weeks', label: '2-4 weeks', icon: '📅' },
  { value: '1-3months', label: '1-3 months', icon: '📆' },
  { value: '3-6months', label: '3-6 months', icon: '🗓️' },
  { value: '6+months', label: '6+ months', icon: '📊' },
];

const experienceOptions = [
  { value: 'beginner', label: 'Beginner (I\'m learning)', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)', icon: '🎯' },
  { value: 'expert', label: 'Expert (3+ years)', icon: '🚀' },
];

const projectTypeOptions = [
  { value: 'webapp', label: 'Web app', icon: '🌐' },
  { value: 'mobile', label: 'Mobile app', icon: '📱' },
  { value: 'api', label: 'API/Backend', icon: '⚙️' },
  { value: 'desktop', label: 'Desktop app', icon: '🖥️' },
  { value: 'fullstack', label: 'Full-stack', icon: '🔧' },
  { value: 'other', label: 'Other', icon: '💡' },
];

const techCategories = {
  frontend: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Remix'],
  backend: ['Node.js', 'Python', 'Go', 'Java', 'Ruby', '.NET'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'],
  deployment: ['Vercel', 'AWS', 'Netlify', 'Railway', 'DigitalOcean'],
};

interface ProjectInputFormProps {
  onSubmit: (data: ProjectFormData) => void;
}

export function ProjectInputForm({ onSubmit }: ProjectInputFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    project: '',
    teamSize: '',
    timeline: '',
    experience: '',
    projectType: '',
    techPreferences: {
      frontend: [],
      backend: [],
      database: [],
      deployment: [],
    },
  });
  const [showTechOptions, setShowTechOptions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.project.length < 20) {
      newErrors.project = 'Please describe your project in at least 20 characters';
    }
    if (!formData.teamSize) {
      newErrors.teamSize = 'Please select team size';
    }
    if (!formData.timeline) {
      newErrors.timeline = 'Please select timeline';
    }
    if (!formData.experience) {
      newErrors.experience = 'Please select experience level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsValidating(true);
    setValidationMessage(null);
    
    try {
      const validation = await validateProject(formData.project);
      
      if (!validation.valid) {
        setValidationMessage(validation.message || "Please provide a clearer project description.");
        setIsValidating(false);
        return;
      }
      
      setIsValidating(false);
      onSubmit(formData);
    } catch (error) {
      console.error('Validation error:', error);
      setIsValidating(false);
      // Continue anyway on error
      onSubmit(formData);
    }
  };

  const toggleTech = (category: keyof typeof techCategories, tech: string) => {
    setFormData(prev => ({
      ...prev,
      techPreferences: {
        ...prev.techPreferences,
        [category]: prev.techPreferences[category].includes(tech)
          ? prev.techPreferences[category].filter(t => t !== tech)
          : [...prev.techPreferences[category], tech],
      },
    }));
  };

  const SelectDropdown = ({ 
    label, 
    icon: Icon, 
    value, 
    options, 
    onChange,
    error,
    tooltip,
  }: { 
    label: string; 
    icon: React.ElementType;
    value: string;
    options: { value: string; label: string; icon?: string }[];
    onChange: (value: string) => void;
    error?: string;
    tooltip?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
        {tooltip && (
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        <select
          className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer ${
            error ? 'border-destructive' : 'border-border'
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.icon} {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Project Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          What are you building?
        </label>
        <div className="relative">
          <textarea
            placeholder="E.g., 'A SaaS analytics dashboard for marketing teams' or 'Mobile app for tracking workouts'"
            className={`w-full px-4 py-4 rounded-xl border bg-background text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[100px] ${
              errors.project ? 'border-destructive' : 'border-border'
            }`}
            value={formData.project}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, project: e.target.value }));
              if (errors.project) setErrors(prev => ({ ...prev, project: '' }));
              if (validationMessage) setValidationMessage(null);
            }}
          />
          <span className={`absolute bottom-3 right-3 text-xs ${
            formData.project.length >= 20 ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {formData.project.length}/500
          </span>
        </div>
        {errors.project && <p className="text-xs text-destructive">{errors.project}</p>}
        
        {/* AI Validation Message */}
        <AnimatePresence>
          {validationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning">{validationMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectDropdown
          label="Team size"
          icon={Users}
          value={formData.teamSize}
          options={teamSizeOptions}
          onChange={(v) => {
            setFormData(prev => ({ ...prev, teamSize: v }));
            if (errors.teamSize) setErrors(prev => ({ ...prev, teamSize: '' }));
          }}
          error={errors.teamSize}
        />
        
        <SelectDropdown
          label="Timeline"
          icon={Calendar}
          value={formData.timeline}
          options={timelineOptions}
          onChange={(v) => {
            setFormData(prev => ({ ...prev, timeline: v }));
            if (errors.timeline) setErrors(prev => ({ ...prev, timeline: '' }));
          }}
          error={errors.timeline}
        />
        
        <SelectDropdown
          label="Your experience level"
          icon={Target}
          value={formData.experience}
          options={experienceOptions}
          onChange={(v) => {
            setFormData(prev => ({ ...prev, experience: v }));
            if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
          }}
          error={errors.experience}
          tooltip="Bob adapts architecture complexity to your experience"
        />
        
        <SelectDropdown
          label="Project type"
          icon={Laptop}
          value={formData.projectType}
          options={projectTypeOptions}
          onChange={(v) => setFormData(prev => ({ ...prev, projectType: v }))}
        />
      </div>

      {/* Tech Preferences Accordion */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          onClick={() => setShowTechOptions(!showTechOptions)}
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Tech Stack Preferences (optional)
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTechOptions ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showTechOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Leave blank for Bob's recommendations based on your project
                </p>
                
                {(Object.entries(techCategories) as [keyof typeof techCategories, string[]][]).map(([category, options]) => (
                  <div key={category} className="space-y-2">
                    <label className="text-xs font-medium text-foreground capitalize">
                      {category}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {options.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTech(category, tech)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            formData.techPreferences[category].includes(tech)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background text-foreground border-border hover:border-primary/50'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={isValidating}
        className="w-full btn-primary text-lg py-4 group disabled:opacity-70 disabled:cursor-not-allowed"
        whileHover={{ scale: isValidating ? 1 : 1.01 }}
        whileTap={{ scale: isValidating ? 1 : 0.99 }}
      >
        {isValidating ? (
          <>
            <motion.div
              className="w-5 h-5 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Validating...
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5 mr-2" />
            Start Building with Bob
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
