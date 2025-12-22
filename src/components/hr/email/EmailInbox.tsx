import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, MailOpen, Search, Filter, RefreshCw, Plus, 
  Paperclip, User, Clock, FileText, Sparkles, Archive,
  Reply, Trash2, UserPlus
} from 'lucide-react';
import { useHREmails, HREmail } from '@/hooks/useHREmails';
import { EmailDetailPanel } from './EmailDetailPanel';
import { EmailImportDialog } from './EmailImportDialog';
import { EmailComposer } from './EmailComposer';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmailInboxProps {
  candidates?: any[];
  jobs?: any[];
  onCreateCandidate?: (data: any) => Promise<any>;
}

export function EmailInbox({ candidates = [], jobs = [], onCreateCandidate }: EmailInboxProps) {
  const { 
    emails, 
    loading, 
    newEmails, 
    inboundEmails, 
    outboundEmails,
    fetchEmails,
    updateEmailStatus,
    deleteEmail,
  } = useHREmails();

  const [selectedEmail, setSelectedEmail] = useState<HREmail | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<HREmail | null>(null);
  const [initialBody, setInitialBody] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = inboundEmails.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && email.status === filter;
  });

  const handleEmailClick = async (email: HREmail) => {
    setSelectedEmail(email);
    if (email.status === 'new') {
      await updateEmailStatus(email.id, 'read');
    }
  };

  const handleReply = (email: HREmail, suggestion?: string) => {
    setReplyToEmail(email);
    setInitialBody(suggestion);
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleArchive = async (email: HREmail) => {
    await updateEmailStatus(email.id, 'archived');
    setSelectedEmail(null);
  };

  const handleDelete = async (email: HREmail) => {
    await deleteEmail(email.id);
    setSelectedEmail(null);
  };

  const getEmailPreview = (email: HREmail) => {
    const text = email.body_text || email.body_html?.replace(/<[^>]*>/g, '') || '';
    return text.substring(0, 100) + (text.length > 100 ? '...' : '');
  };

  if (isComposing) {
    return (
      <EmailComposer
        replyTo={replyToEmail || undefined}
        initialBody={initialBody}
        candidates={candidates}
        jobs={jobs}
        onClose={() => {
          setIsComposing(false);
          setReplyToEmail(null);
          setInitialBody(undefined);
        }}
        onSent={() => {
          setIsComposing(false);
          setReplyToEmail(null);
          setInitialBody(undefined);
          fetchEmails();
        }}
      />
    );
  }

  if (selectedEmail) {
    return (
      <EmailDetailPanel
        email={selectedEmail}
        candidates={candidates}
        onBack={() => setSelectedEmail(null)}
        onReply={(suggestion) => handleReply(selectedEmail, suggestion)}
        onArchive={() => handleArchive(selectedEmail)}
        onDelete={() => handleDelete(selectedEmail)}
        onCreateCandidate={onCreateCandidate}
      />
    );
  }

  if (selectedEmail) {
    return (
      <EmailDetailPanel
        email={selectedEmail}
        candidates={candidates}
        onBack={() => setSelectedEmail(null)}
        onReply={() => handleReply(selectedEmail)}
        onArchive={() => handleArchive(selectedEmail)}
        onDelete={() => handleDelete(selectedEmail)}
        onCreateCandidate={onCreateCandidate}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Messagerie HR</h2>
            <p className="text-sm text-muted-foreground">
              {newEmails.length} nouveau{newEmails.length > 1 ? 'x' : ''} message{newEmails.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEmails()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <EmailImportDialog candidates={candidates}>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Importer
            </Button>
          </EmailImportDialog>
          <Button variant="default" size="sm" onClick={() => setIsComposing(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              Tous
              <Badge variant="secondary" className="ml-1">{inboundEmails.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-1.5">
              Nouveaux
              <Badge variant="secondary" className="ml-1">{newEmails.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="replied">Répondus</TabsTrigger>
            <TabsTrigger value="archived">Archivés</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email List */}
      <Card>
        <ScrollArea className="h-[calc(100vh-320px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-medium text-foreground mb-1">Aucun email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Importez des emails ou configurez la réception automatique
              </p>
              <EmailImportDialog candidates={candidates}>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Importer un email
                </Button>
              </EmailImportDialog>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`group p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    email.status === 'new' ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status indicator */}
                    <div className="mt-1">
                      {email.status === 'new' ? (
                        <Mail className="w-5 h-5 text-primary" />
                      ) : (
                        <MailOpen className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium truncate ${email.status === 'new' ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {email.from_name || email.from_email}
                        </span>
                        {email.candidate && (
                          <Badge variant="outline" className="gap-1 shrink-0">
                            <User className="w-3 h-3" />
                            {email.candidate.name}
                          </Badge>
                        )}
                        {email.ai_analysis?.cv_detected && (
                          <Badge variant="secondary" className="gap-1 shrink-0">
                            <FileText className="w-3 h-3" />
                            CV
                          </Badge>
                        )}
                        {email.attachments && email.attachments.length > 0 && (
                          <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      
                      <h4 className={`text-sm truncate mb-1 ${email.status === 'new' ? 'font-medium' : ''}`}>
                        {email.subject}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {getEmailPreview(email)}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-muted-foreground shrink-0 text-right">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(email.email_date), { addSuffix: true, locale: fr })}
                      </div>
                    </div>
                  </div>

                  {/* Quick actions on hover */}
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(email);
                      }}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Répondre
                    </Button>
                    {!email.candidate && onCreateCandidate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Create candidate logic
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Créer candidat
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}
