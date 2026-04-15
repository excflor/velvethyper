# VelvetHyper Phase 5: Production Guest Tools Makefile
# Designed for MinGW-w64 (MSYS2) on Windows

CXX = g++
CXXFLAGS = -O3 -Wall -I. -static
LDFLAGS = -lshlwapi -liphlpapi

TARGETS = sanitizer.exe verifier.exe launcher.exe

all: $(TARGETS)

sanitizer.exe: sanitizer.cpp common.h
	$(CXX) $(CXXFLAGS) -o sanitizer.exe sanitizer.cpp $(LDFLAGS)

verifier.exe: verifier.cpp common.h
	$(CXX) $(CXXFLAGS) -o verifier.exe verifier.cpp $(LDFLAGS)

launcher.exe: launcher.cpp
	$(CXX) $(CXXFLAGS) -o launcher.exe launcher.cpp

clean:
	rm -f *.exe *.o

.PHONY: all clean
