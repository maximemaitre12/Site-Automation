import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Mail, MailOpen, Search, RefreshCw, 
  Paperclip, User, Clock, FileText, Sparkles, Loader2,
  Reply, Trash2, UserPlus, Inbox, CheckCircle2
} from 'lucide-react';
import { useHREmails, HREmail } from '@/hooks/useHREmails';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { EmailDetailPanel } from './EmailDetailPanel';
import { EmailComposer } from './EmailComposer';
import { EmailExtractor } from './EmailExtractor';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const { status: googleOAuthStatus, checking: oauthChecking } = useGoogleOAuth();

  const [selectedEmail, setSelectedEmail] = useState<HREmail | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<HREmail | null>(null);
  const [initialBody, setInitialBody] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'extraction'>('inbox');
  
  // Gmail search state
  const [gmailSearchQuery, setGmailSearchQuery] = useState('');
  const [gmailSearchResults, setGmailSearchResults] = useState<any[]>([]);
  const [searchingGmail, setSearchingGmail] = useState(false);

  const isGoogleConnected = googleOAuthStatus?.connected && googleOAuthStatus.email;

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

  // Search Gmail using Google OAuth
  const handleGmailSearch = async () => {
    if (!gmailSearchQuery.trim()) {
      toast.error('Entrez un terme de recherche');
      return;
    }

    setSearchingGmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-search', {
        body: { query: gmailSearchQuery },
      });

      if (error) throw error;

      if (data?.emails) {
        setGmailSearchResults(data.emails);
        toast.success(`${data.emails.length} email(s) trouvé(s)`);
      } else {
        setGmailSearchResults([]);
        toast.info('Aucun email trouvé');
      }
    } catch (error: any) {
      console.error('Gmail search error:', error);
      toast.error('Erreur lors de la recherche Gmail');
    } finally {
      setSearchingGmail(false);
    }
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

  // Loading OAuth status
  if (oauthChecking) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not connected - show message to connect in Agent Flow
  if (!isGoogleConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Aucun compte Google connecté</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Pour rechercher vos emails, connectez votre compte Google dans <strong>Agent Flow</strong> 
              en configurant un bloc Gmail avec vos credentials OAuth.
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" asChild>
              <a href="/tools/flow">
                Aller à Agent Flow
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with connected account */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Messagerie HR</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>{googleOAuthStatus.email}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEmails()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="default" size="sm" onClick={() => setIsComposing(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Gmail Search */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans vos emails Gmail (ex: candidature, CV, entretien...)"
              value={gmailSearchQuery}
              onChange={(e) => setGmailSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGmailSearch()}
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Button 
            onClick={handleGmailSearch} 
            disabled={searchingGmail}
            className="h-11 px-6"
          >
            {searchingGmail ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Rechercher
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Recherchez directement dans votre boîte Gmail connectée
        </p>
      </Card>

      {/* Gmail Search Results */}
      {gmailSearchResults.length > 0 && (
        <Card>
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Résultats Gmail ({gmailSearchResults.length})
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setGmailSearchResults([])}
              >
                Fermer
              </Button>
            </div>
          </div>
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y divide-border">
              {gmailSearchResults.map((email, index) => (
                <div
                  key={email.id || index}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {email.from || 'Expéditeur inconnu'}
                        </span>
                        {email.hasAttachments && (
                          <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <h4 className="text-sm font-medium truncate mb-1">
                        {email.subject || '(Sans objet)'}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {email.snippet || ''}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {email.date && formatDistanceToNow(new Date(email.date), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Main Tabs: Inbox vs Extraction */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'inbox' | 'extraction')}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="inbox" className="gap-2">
            <Inbox className="w-4 h-4" />
            Emails importés
            {newEmails.length > 0 && (
              <Badge variant="secondary" className="ml-1">{newEmails.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="extraction" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Extraction IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extraction" className="mt-4">
          <EmailExtractor onComplete={() => {
            fetchEmails();
            setActiveTab('inbox');
          }} />
        </TabsContent>

        <TabsContent value="inbox" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les emails importés..."
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
            <ScrollArea className="h-[calc(100vh-500px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="font-medium text-foreground mb-1">Aucun email importé</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Utilisez la recherche Gmail ci-dessus ou l'onglet "Extraction IA"
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('extraction')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Lancer une extraction
                  </Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
