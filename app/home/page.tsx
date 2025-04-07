"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Upload,
  Download,
  Heart,
  Share2,
  Trash2,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProfilePic {
  id: string;
  url: string;
  tags: string[];
  isPersonal: boolean;
  likes: number;
  description?: string;
  createdAt: number;
}

const SORT_OPTIONS = {
  RECENT: "recent",
  POPULAR: "popular",
  OLDEST: "oldest",
} as const;

type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

const API_CATEGORIES = [
  "gaming",
  "cyberpunk",
  "neon",
  "portrait",
  "anime",
  "abstract",
  "tech",
  "dark",
  "minimal",
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [personalPics, setPersonalPics] = useState<ProfilePic[]>([]);
  const [apiPics, setApiPics] = useState<ProfilePic[]>([]);
  const [selectedPic, setSelectedPic] = useState<ProfilePic | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.RECENT);
  const [likedPics, setLikedPics] = useState<Set<string>>(new Set());
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");
  const [isLoadingApiPics, setIsLoadingApiPics] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const fetchApiImages = async (query?: string) => {
    setIsLoadingApiPics(true);

    try {
      // Simulation d'API pour l'exemple
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const simulatedCategories: Record<string, string[]> = {
        gaming: ["setup gaming", "écran", "clavier RGB", "souris gaming"],
        cyberpunk: ["style cyberpunk", "néons", "futuriste", "dystopie"],
        neon: ["lumières néon", "éclairage coloré", "ambiance sombre"],
        portrait: ["portrait gaming", "portrait joueur", "streamer"],
        dark: ["fond sombre", "minimaliste", "ambiance tamisée"],
      };

      const searchQuery = query || selectedCategory || "gaming profile";
      const perPage = 12;

      const simulatedResponse = Array.from({ length: perPage }, (_, i) => {
        const randomId = Math.floor(Math.random() * 1000) + Date.now();
        const randomWidth = 800 + Math.floor(Math.random() * 600);
        const randomHeight = 800 + Math.floor(Math.random() * 600);

        let tags: string[];
        if (searchQuery in simulatedCategories) {
          tags = [
            searchQuery,
            ...simulatedCategories[searchQuery].slice(
              0,
              2 + Math.floor(Math.random() * 2)
            ),
          ];
        } else {
          tags = [
            "gaming",
            API_CATEGORIES[Math.floor(Math.random() * API_CATEGORIES.length)],
            "profil",
          ];
        }

        return {
          id: `api-${randomId}`,
          url: `https://picsum.photos/id/${
            200 + i + Math.floor(Math.random() * 100)
          }/${randomWidth}/${randomHeight}`,
          tags: tags,
          isPersonal: false,
          likes: Math.floor(Math.random() * 300) + 50,
          description: `Pictures ${searchQuery} generates`,
          createdAt: Date.now() - Math.floor(Math.random() * 30) * 86400000,
        };
      });

      setApiPics(simulatedResponse);
    } catch (error) {
      console.error("Error while loading images:", error);
      toast.error("Error while loading images");
    } finally {
      setIsLoadingApiPics(false);
    }
  };

  useEffect(() => {
    const savedPics = localStorage.getItem("personalPics");
    const savedLikes = localStorage.getItem("likedPics");
    if (savedPics) {
      setPersonalPics(JSON.parse(savedPics));
    }
    if (savedLikes) {
      setLikedPics(new Set(JSON.parse(savedLikes)));
    }

    fetchApiImages();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim())) {
      setNewTags([...newTags, tagInput.trim()]);
      setTagInput("");
      tagInputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTags(newTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const filteredPics = [...apiPics, ...personalPics]
    .filter(
      (pic) =>
        pic.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (typeof pic.description === "string" &&
          pic.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.RECENT:
          return b.createdAt - a.createdAt;
        case SORT_OPTIONS.POPULAR:
          return b.likes - a.likes;
        case SORT_OPTIONS.OLDEST:
          return a.createdAt - b.createdAt;
        default:
          return 0;
      }
    });

  const importFromApi = (pic: ProfilePic) => {
    const importedPic: ProfilePic = {
      id: `imported-${Date.now()}`,
      url: pic.url,
      tags: [...pic.tags, "importé"],
      isPersonal: true,
      likes: 0,
      description: pic.description,
      createdAt: Date.now(),
    };

    const updatedPics = [...personalPics, importedPic];
    setPersonalPics(updatedPics);
    localStorage.setItem("personalPics", JSON.stringify(updatedPics));
    toast.success("Image successfully imported into your collection!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("The image must not exceed 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPic: ProfilePic = {
          id: Date.now().toString(),
          url: reader.result as string,
          tags: newTags.length > 0 ? newTags : ["personal", "gaming"],
          isPersonal: true,
          likes: 0,
          description: description.trim() || undefined,
          createdAt: Date.now(),
        };
        const updatedPics = [...personalPics, newPic];
        setPersonalPics(updatedPics);
        localStorage.setItem("personalPics", JSON.stringify(updatedPics));
        setNewTags([]);
        setDescription("");
        toast.success("Image successfully added!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (pic: ProfilePic) => {
    const newLikedPics = new Set(likedPics);
    if (likedPics.has(pic.id)) {
      newLikedPics.delete(pic.id);
      pic.likes--;
    } else {
      newLikedPics.add(pic.id);
      pic.likes++;
    }
    setLikedPics(newLikedPics);
    localStorage.setItem("likedPics", JSON.stringify(Array.from(newLikedPics)));
  };

  const handleShare = async (pic: ProfilePic) => {
    try {
      await navigator.clipboard.writeText(pic.url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Error while copying the link");
    }
  };

  const handleDelete = (picToDelete: ProfilePic) => {
    const updatedPics = personalPics.filter((pic) => pic.id !== picToDelete.id);
    setPersonalPics(updatedPics);
    localStorage.setItem("personalPics", JSON.stringify(updatedPics));
    toast.success("Picture deleted");
  };

  const startDownload = (pic: ProfilePic) => {
    setSelectedPic(pic);
    setIsDownloading(true);
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDownloading(false);
          const link = document.createElement("a");
          link.href = pic.url;
          link.download = `profile-pic-${pic.id}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Download complete!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background grid-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-2 text-center mb-12 fade-in">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Zenith Pictures
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
            Download and share stylish profile pictures
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10 bg-secondary/50 font-medium border-0 focus-visible:ring-1 focus-visible:ring-black"
              placeholder="Search by tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-white text-black font-medium border-0 rounded-md px-4 py-2 text-sm focus:ring-1 focus:ring-black"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value={SORT_OPTIONS.RECENT}>Most recent</option>
            <option value={SORT_OPTIONS.POPULAR}>Most popular</option>
            <option value={SORT_OPTIONS.OLDEST}>Most older</option>
          </select>
        </div>

        <div className="mb-8 overflow-x-auto fade-in">
          <div className="flex gap-2 pb-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchApiImages(selectedCategory)}
              disabled={isLoadingApiPics}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  isLoadingApiPics ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="api" className="mb-8">
          <TabsList className="w-full justify-start border border-zinc-800 bg-background p-1 fade-in">
            <TabsTrigger
              value="api"
              className="data-[state=active]:bg-secondary"
            >
              Pictures generates
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-secondary"
            >
             My Pictures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            {isLoadingApiPics ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPics
                  .filter((pic) => !pic.isPersonal)
                  .map((pic, index) => (
                    <Card
                      key={pic.id}
                      className="gradient-border hover-card bg-secondary/50 overflow-hidden fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative aspect-square group">
                        <img
                          src={pic.url}
                          alt="Profile"
                          className="object-cover w-full h-full transition-all duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            {pic.description && (
                              <p className="text-sm text-zinc-300 mb-3">
                                {pic.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {pic.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-zinc-900/80 hover:bg-zinc-800"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 mb-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 bg-zinc-900/80 hover:bg-zinc-800"
                                onClick={() => handleLike(pic)}
                              >
                                <Heart
                                  className={`h-4 w-4 mr-2 ${
                                    likedPics.has(pic.id)
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                                {pic.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 bg-zinc-900/80 hover:bg-zinc-800"
                                onClick={() => handleShare(pic)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </div>
                            <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                              <span>Add on {formatDate(pic.createdAt)}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 bg-white text-black"
                                onClick={() => startDownload(pic)}
                                disabled={isDownloading}
                              >
                                {isDownloading && selectedPic?.id === pic.id ? (
                                  `Téléchargement dans ${countdown}s...`
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </>
                                )}
                              </Button>
                              <Button
                                className="flex-1 bg-white text-black"
                                onClick={() => importFromApi(pic)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Import
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="gradient-border hover-card bg-secondary/50 p-8 flex items-center justify-center fade-in cursor-pointer">
                    <div className="text-center group">
                      <div className="p-4 rounded-full bg-zinc-900/80 group-hover:bg-zinc-800 transition-colors mb-4">
                        <Plus className="h-8 w-8" />
                      </div>
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                      Add a photo
                      </p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add new picture</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Décrivez votre image..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2 py-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          ref={tagInputRef}
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button onClick={handleAddTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block">
                        <span className="sr-only">Choose a file</span>
                        <input
                          type="file"
                          className="block w-full text-sm text-zinc-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-zinc-900 file:text-white
                            hover:file:bg-zinc-800"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-xs text-zinc-500">
                      Accepted format: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              {filteredPics
                .filter((pic) => pic.isPersonal)
                .map((pic, index) => (
                  <Card
                    key={pic.id}
                    className="gradient-border hover-card bg-secondary/50 overflow-hidden fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative aspect-square group">
                      <img
                        src={pic.url}
                        alt="Profile"
                        className="object-cover w-full h-full transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {pic.description && (
                            <p className="text-sm text-zinc-300 mb-3">
                              {pic.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pic.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-zinc-900/80 hover:bg-zinc-800"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2 mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 bg-zinc-900/80 hover:bg-zinc-800"
                              onClick={() => handleShare(pic)}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 bg-zinc-900/80 hover:bg-zinc-800 hover:text-red-500"
                              onClick={() => handleDelete(pic)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#b3b3b3] mb-3">
                            <span>dded on {formatDate(pic.createdAt)}</span>
                          </div>
                          <Button
                            className="w-full bg-white text-black"
                            onClick={() => startDownload(pic)}
                            disabled={isDownloading}
                          >
                            {isDownloading && selectedPic?.id === pic.id ? (
                              `Téléchargement dans ${countdown}s...`
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
