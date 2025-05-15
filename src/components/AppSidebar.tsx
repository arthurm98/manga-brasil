
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useManga } from '../context/MangaContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Search, BookOpen, Book, BookCheck, ListCheck, Settings, BarChart } from "lucide-react";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function AppSidebar() {
  const { currentlyReading, planToRead, completed } = useManga();
  
  return (
    <Sidebar>
      <SidebarHeader className="px-6 py-5 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-manga">MangaTrack</h1>
        <p className="text-sidebar-foreground/70 text-sm">Seu rastreador de mangás</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <BookOpen size={18} />
                    <span>Início</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/search" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <Search size={18} />
                    <span>Pesquisar</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/statistics" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <BarChart size={18} />
                    <span>Estatísticas</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 pt-5">Minha Biblioteca</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/reading" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <Book size={18} />
                    <span>Lendo</span>
                    <span className="ml-auto bg-sidebar-accent/30 px-2 py-0.5 rounded text-xs">
                      {currentlyReading.length}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/plan-to-read" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <ListCheck size={18} />
                    <span>Planejo Ler</span>
                    <span className="ml-auto bg-sidebar-accent/30 px-2 py-0.5 rounded text-xs">
                      {planToRead.length}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/completed" className={({ isActive }) => 
                    cn("flex items-center gap-3 px-3 py-2 rounded-md", 
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50")}>
                    <BookCheck size={18} />
                    <span>Completos</span>
                    <span className="ml-auto bg-sidebar-accent/30 px-2 py-0.5 rounded text-xs">
                      {completed.length}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button variant="outline" asChild className="w-full">
          <NavLink to="/settings" className="flex items-center justify-center gap-2">
            <Settings size={16} />
            <span>Configurações</span>
          </NavLink>
        </Button>
        <p className="text-xs text-center text-sidebar-foreground/50 mt-4">MangaTrack by ArthurM</p>
      </SidebarFooter>
    </Sidebar>
  );
}
